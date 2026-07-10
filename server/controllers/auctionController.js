import { Auction, AuctionBid } from "../models/Auction.js";
import { Profile } from "../models/Profile.js";
import { Notification } from "../models/Notification.js";

export async function getAuctions(req, res, next) {
  try {
    const auctions = await Auction.find().sort({ endsAt: 1 }).lean();

    const results = await Promise.all(
      auctions.map(async (auction) => {
        const bids = await AuctionBid.find({ auctionId: auction._id })
          .sort({ amount: -1 })
          .lean();

        const bidHistory = bids.map((b) => ({
          name: b.bidderName,
          amount: b.amount,
          isCurrent: b.isCurrent,
          isWinning: b.isWinning,
        }));

        return {
          ...auction,
          id: String(auction._id),
          highestBid: auction.highestBid || auction.startingBid,
          bidders: bids.length,
          bidHistory,
        };
      })
    );

    return res.json({ auctions: results });
  } catch (error) {
    next(error);
  }
}

export async function createAuction(req, res, next) {
  try {
    const {
      listingId,
      resourceName,
      category,
      condition,
      estimatedValue,
      startingBid,
      reservePrice,
      durationDays,
    } = req.body;

    const profile = await Profile.findOne({ userId: req.user.id });

    const endsAt = new Date(Date.now() + (durationDays || 3) * 24 * 60 * 60 * 1000);

    const auction = await Auction.create({
      listingId,
      ownerId: req.user.id,
      ownerName: profile?.displayName || "Relay Trader",
      ownerInitials: profile?.avatarInitials || "RT",
      ownerColor: profile?.avatarColor || "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]",
      resourceName,
      category,
      condition,
      estimatedValue,
      startingBid: startingBid || 0,
      highestBid: startingBid || 0,
      suggestedBid: Math.round((startingBid || 0) * 1.06),
      reservePrice,
      endsAt,
    });

    const io = req.app.get("io");
    if (io) {
      io.emit("auction_created", auction);
    }

    return res.status(201).json({ auction });
  } catch (error) {
    next(error);
  }
}

export async function placeBid(req, res, next) {
  try {
    const { amount } = req.body;
    const auctionId = req.params.auctionId;

    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    if (auction.status !== "active") {
      return res.status(400).json({ message: "Auction is not active" });
    }

    const currentHighest = auction.highestBid || auction.startingBid;
    if (amount <= currentHighest) {
      return res.status(400).json({ message: `Bid must be higher than currently leading $${currentHighest}` });
    }

    // Find the previous winning bidder to trigger outbid notification
    const previousWinnerBid = await AuctionBid.findOne({ auctionId, isWinning: true });
    
    // Set all previous bids to isCurrent = false and isWinning = false
    await AuctionBid.updateMany({ auctionId }, { $set: { isCurrent: false, isWinning: false } });

    // Fetch the current bidder profile
    const profile = await Profile.findOne({ userId: req.user.id });
    const bidderName = profile?.displayName || "Relay Trader";
    const bidderInitials = profile?.avatarInitials || "RT";

    // Create new bid
    const newBid = await AuctionBid.create({
      auctionId,
      bidderId: req.user.id,
      bidderName,
      bidderInitials,
      amount,
      isCurrent: true,
      isWinning: true,
    });

    // Update auction metadata
    auction.highestBid = amount;
    auction.suggestedBid = amount + Math.round(amount * 0.06);
    await auction.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("bid_received", {
        auctionId: String(auction._id),
        highestBid: amount,
        suggestedBid: auction.suggestedBid,
        newBid: {
          name: bidderName,
          amount,
          isCurrent: true,
          isWinning: true,
        },
      });
    }

    // Notify the auction owner
    if (auction.ownerId.toString() !== req.user.id) {
      const ownerNotification = await Notification.create({
        userId: auction.ownerId,
        type: "auction_bid",
        title: "New Bid Placed",
        detail: `${bidderName} bid $${amount} on your listing "${auction.resourceName}"`,
        metadata: { auctionId },
      });

      if (io) {
        io.to(auction.ownerId.toString()).emit("notification_received", {
          id: ownerNotification._id,
          title: ownerNotification.title,
          detail: ownerNotification.detail,
          unread: true,
          time: "Just now",
        });
      }
    }

    // Notify the outbid user
    if (previousWinnerBid && previousWinnerBid.bidderId.toString() !== req.user.id) {
      const outbidNotification = await Notification.create({
        userId: previousWinnerBid.bidderId,
        type: "auction_outbid",
        title: "You have been Outbid!",
        detail: `Someone placed a higher bid of $${amount} on "${auction.resourceName}". bid again!`,
        metadata: { auctionId },
      });

      if (io) {
        io.to(previousWinnerBid.bidderId.toString()).emit("notification_received", {
          id: outbidNotification._id,
          title: outbidNotification.title,
          detail: outbidNotification.detail,
          unread: true,
          time: "Just now",
        });
      }
    }

    return res.status(201).json({ message: "Bid placed successfully", auction });
  } catch (error) {
    next(error);
  }
}

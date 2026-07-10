import mongoose from "mongoose";

const auctionBidSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
      index: true,
    },
    bidderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bidderName: String,
    bidderInitials: String,
    amount: { type: Number, required: true },
    isCurrent: { type: Boolean, default: false },
    isWinning: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const auctionSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
      unique: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    ownerName: String,
    ownerInitials: String,
    ownerColor: String,
    resourceName: String,
    category: String,
    condition: String,
    estimatedValue: String,
    status: {
      type: String,
      enum: ["scheduled", "active", "ended", "cancelled"],
      default: "active",
      index: true,
    },
    startingBid: { type: Number, default: 0 },
    highestBid: { type: Number, default: 0 },
    suggestedBid: { type: Number, default: 0 },
    reservePrice: Number,
    winnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    winningBid: Number,
    daysListed: { type: Number, default: 0 },
    popularity: { type: String, default: "Moderate" },
    aiVerified: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    distance: String,
    endsAt: { type: Date, required: true, index: true },
    endedAt: Date,
  },
  { timestamps: true }
);

export const Auction = mongoose.model("Auction", auctionSchema);
export const AuctionBid = mongoose.model("AuctionBid", auctionBidSchema);

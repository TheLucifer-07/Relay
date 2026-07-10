import { ExchangeSession } from "../models/ExchangeSession.js";
import { Listing } from "../models/Listing.js";
import { Message } from "../models/Message.js";
import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";
import { Review } from "../models/Review.js";
import { Notification } from "../models/Notification.js";
import mongoose from "mongoose";

export async function getExchangeSessions(req, res, next) {
  try {
    const sessions = await ExchangeSession.find({
      $or: [{ initiatorId: req.user.id }, { receiverId: req.user.id }]
    })
      .populate("listingId")
      .sort({ updatedAt: -1 })
      .lean();

    const result = await Promise.all(
      sessions.map(async (session) => {
        const otherUserId = session.initiatorId.toString() === req.user.id
          ? session.receiverId
          : session.initiatorId;

        const otherUser = await User.findById(otherUserId).lean();
        const otherProfile = await Profile.findOne({ userId: otherUserId }).lean();
        if (otherProfile && otherUser) {
          otherProfile.isSeedUser = otherUser.isSeedUser || false;
        }
        
        const lastMessage = await Message.findOne({ sessionId: session._id })
          .sort({ createdAt: -1 })
          .lean();

        const unreadCount = await Message.countDocuments({
          sessionId: session._id,
          senderId: { $ne: req.user.id },
          isRead: false
        });

        const hasReviewed = await Review.exists({
          sessionId: session._id,
          authorId: req.user.id
        });

        return {
          ...session,
          otherProfile,
          lastMessage: lastMessage ? lastMessage.text : "No messages yet",
          unreadCount,
          hasReviewed: Boolean(hasReviewed)
        };
      })
    );

    return res.json({ sessions: result });
  } catch (error) {
    next(error);
  }
}

export async function createExchangeSession(req, res, next) {
  try {
    const {
      listingId,
      targetUserId,
      offeredItems,
      selectedResourceIds,
      messageText,
      sourceType = "listing",
      sourceId,
      sourceTitle,
      lookingFor,
    } = req.body;

    // Determine receiver: from explicit targetUserId, or from listing ownership
    let receiverId = targetUserId;
    let listing = null;

    if (listingId && mongoose.Types.ObjectId.isValid(listingId)) {
      listing = await Listing.findById(listingId);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      receiverId = receiverId || listing.userId.toString();
    }

    if (!receiverId) {
      return res.status(400).json({ message: "targetUserId or listingId is required" });
    }

    // Verify target user exists (supports seedUserKey format e.g. "demo-user-5")
    let targetUser = null;
    if (mongoose.Types.ObjectId.isValid(receiverId)) {
      targetUser = await User.findById(receiverId);
    } else {
      targetUser = await User.findOne({ seedUserKey: receiverId });
    }

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    receiverId = targetUser._id.toString();

    if (receiverId === req.user.id) {
      return res.status(400).json({ message: "You cannot initiate a trade with yourself" });
    }

    // Idempotent check: return existing active session
    const activeStatuses = ["pending", "negotiation_started", "negotiation_active", "offer_sent", "counter_offered", "accepted", "meeting_scheduled", "resources_exchanged"];
    const querySourceId = sourceId || (listingId ? listingId.toString() : null);

    let existing = null;
    if (querySourceId) {
      existing = await ExchangeSession.findOne({
        sourceId: querySourceId,
        $or: [
          { initiatorId: req.user.id, receiverId: receiverId },
          { initiatorId: receiverId, receiverId: req.user.id }
        ],
        status: { $in: activeStatuses }
      });
    }

    if (!existing && listingId) {
      existing = await ExchangeSession.findOne({
        listingId,
        $or: [
          { initiatorId: req.user.id, receiverId: receiverId },
          { initiatorId: receiverId, receiverId: req.user.id }
        ],
        status: { $in: activeStatuses }
      });
    }

    if (existing) {
      return res.status(200).json({
        message: "Active session exists",
        session: existing
      });
    }

    // Build offered items from selectedResourceIds or direct offeredItems
    const resolvedOfferedItems = offeredItems || [];

    const session = await ExchangeSession.create({
      listingId: listingId || null,
      initiatorId: req.user.id,
      receiverId,
      sourceType: sourceType || "listing",
      sourceId: querySourceId || null,
      sourceTitle: sourceTitle || listing?.title || null,
      lookingFor: lookingFor || listing?.lookingFor || null,
      selectedResourceIds: selectedResourceIds || [],
      offeredItems: resolvedOfferedItems,
      status: "pending",
      offeredValue: resolvedOfferedItems.reduce((acc, curr) =>
        acc + (parseFloat(String(curr.value || "").replace(/[^0-9.]/g, "")) || 0), 0
      ) || 0
    });

    // Create initial message
    const listingTitle = sourceTitle || listing?.title || "this listing";
    const msgText = messageText || `Hi! I want to negotiate regarding "${listingTitle}".`;
    await Message.create({
      sessionId: session._id,
      senderId: req.user.id,
      text: msgText,
      type: "text"
    });

    // Send notification
    const profile = await Profile.findOne({ userId: req.user.id });
    const notification = await Notification.create({
      userId: receiverId,
      type: "trade_request",
      title: "New Trade Request",
      detail: `${profile?.displayName || "Someone"} wants to negotiate regarding "${listingTitle}"`,
      metadata: { sessionId: session._id }
    });

    // Realtime alerts
    const io = req.app.get("io");
    if (io) {
      io.to(receiverId.toString()).emit("notification_received", {
        id: notification._id,
        title: notification.title,
        detail: notification.detail,
        unread: true,
        time: "Just now"
      });
      io.to(receiverId.toString()).emit("session_created", session);
    }

    return res.status(201).json({ session });
  } catch (error) {
    next(error);
  }
}

export async function updateSessionStatus(req, res, next) {
  try {
    const { status, cancellationReason, meetingTime, meetingLocation } = req.body;
    const session = await ExchangeSession.findById(req.params.sessionId).populate("listingId");
    if (!session) {
      return res.status(404).json({ message: "Exchange session not found" });
    }

    // Authorization: User must be initiator or receiver
    const isInitiator = session.initiatorId.toString() === req.user.id;
    const isReceiver = session.receiverId.toString() === req.user.id;
    if (!isInitiator && !isReceiver) {
      return res.status(403).json({ message: "Not authorized to update this session" });
    }

    const previousStatus = session.status;
    session.status = status;

    if (status === "cancelled") {
      session.cancelledAt = new Date();
      session.cancelReason = cancellationReason || "";
    } else if (status === "completed") {
      session.completedAt = new Date();
      // Mark listing as traded/completed
      await Listing.findByIdAndUpdate(session.listingId, { status: "Traded" });
    } else if (status === "meeting_scheduled") {
      if (meetingTime) session.meetingTime = new Date(meetingTime);
      if (meetingLocation) session.meetingLocation = meetingLocation;
    }

    await session.save();

    // Create system message inside thread
    const userProfile = await Profile.findOne({ userId: req.user.id });
    let systemText = `${userProfile?.displayName || "User"} updated status to ${status}.`;
    if (status === "negotiation_started") {
      systemText = "Negotiation started. Start discussing trade parameters!";
    } else if (status === "negotiation_active") {
      systemText = "Negotiation is now active.";
    } else if (status === "offer_accepted" || status === "accepted") {
      systemText = `${userProfile?.displayName || "User"} accepted the proposed exchange.`;
    } else if (status === "resources_exchanged") {
      systemText = "Resources exchanged! Waiting for final trade completion.";
    } else if (status === "declined") {
      systemText = "Trade request declined.";
    } else if (status === "cancelled") {
      systemText = `Trade request cancelled. Reason: ${cancellationReason || "None specified"}`;
    } else if (status === "completed") {
      systemText = "Exchange completed! Please leave a review to update reputations.";
    } else if (status === "meeting_scheduled") {
      systemText = `Meeting scheduled at ${meetingLocation} on ${new Date(meetingTime).toLocaleString()}.`;
    }

    await Message.create({
      sessionId: session._id,
      senderId: req.user.id, // System messages can have sender as updater or null
      text: systemText,
      type: "system"
    });

    // Notify other user
    const otherUserId = isInitiator ? session.receiverId : session.initiatorId;
    
    let notifType = "system";
    if (status === "accepted" || status === "offer_accepted") notifType = "offer_accepted";
    else if (status === "completed") notifType = "trade_completed";
    else if (status === "meeting_scheduled") notifType = "meeting_scheduled";
    else if (status === "cancelled") notifType = "trade_cancelled";
    else if (status === "declined") notifType = "trade_declined";

    const notification = await Notification.create({
      userId: otherUserId,
      type: notifType,
      title: `Exchange Update`,
      detail: systemText,
      metadata: { sessionId: session._id }
    });

    const io = req.app.get("io");
    if (io) {
      io.to(otherUserId.toString()).emit("session_updated", { sessionId: session._id, status, previousStatus });
      io.to(otherUserId.toString()).emit("notification_received", {
        id: notification._id,
        title: notification.title,
        detail: notification.detail,
        unread: true,
        time: "Just now"
      });
    }

    return res.json({ session });
  } catch (error) {
    next(error);
  }
}

export async function getMessages(req, res, next) {
  try {
    const session = await ExchangeSession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ message: "Exchange session not found" });
    }

    if (session.initiatorId.toString() !== req.user.id && session.receiverId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view these messages" });
    }

    const messages = await Message.find({ sessionId: req.params.sessionId })
      .sort({ createdAt: 1 })
      .lean();

    // Mark messages sent by the other user as read
    await Message.updateMany(
      { sessionId: req.params.sessionId, senderId: { $ne: req.user.id }, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    return res.json({ messages });
  } catch (error) {
    next(error);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const { text, type, offerPayload } = req.body;
    const session = await ExchangeSession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ message: "Exchange session not found" });
    }

    const isInitiator = session.initiatorId.toString() === req.user.id;
    const isReceiver = session.receiverId.toString() === req.user.id;
    if (!isInitiator && !isReceiver) {
      return res.status(403).json({ message: "Not authorized to send messages in this session" });
    }

    const message = await Message.create({
      sessionId: session._id,
      senderId: req.user.id,
      text: text || "",
      type: type || "text",
      offerPayload: offerPayload || null
    });

    const otherUserId = isInitiator ? session.receiverId : session.initiatorId;

    const io = req.app.get("io");
    if (io) {
      io.to(otherUserId.toString()).emit("message_received", message);
    }

    // Touch session timestamps
    session.updatedAt = new Date();
    await session.save();

    return res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
}

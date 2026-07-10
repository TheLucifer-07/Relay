import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "trade_request",
        "trade_accepted",
        "trade_declined",
        "counter_offer",
        "message_received",
        "auction_bid",
        "auction_won",
        "auction_outbid",
        "review_received",
        "listing_verified",
        "listing_trending",
        "trust_score_updated",
        "trade_completed",
        "meeting_scheduled",
        "offer_accepted",
        "trade_cancelled",
        "system",
      ],
      default: "system",
    },
    title: { type: String, required: true },
    detail: { type: String, default: "" },
    isRead: { type: Boolean, default: false, index: true },
    readAt: Date,
    actionUrl: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExchangeSession",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "trade_offer", "counter_offer", "system", "image"],
      default: "text",
    },
    text: String,
    imageUrl: String,
    offerPayload: mongoose.Schema.Types.Mixed,
    isRead: { type: Boolean, default: false },
    readAt: Date,
  },
  { timestamps: true }
);

messageSchema.index({ sessionId: 1, createdAt: 1 });

export const Message = mongoose.model("Message", messageSchema);

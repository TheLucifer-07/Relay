import mongoose from "mongoose";

const exchangeSessionSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      index: true,
    },
    initiatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Source type/id for request-based negotiations
    sourceType: {
      type: String,
      enum: ["listing", "request", "auction"],
      default: "listing",
    },
    sourceId: {
      type: String,
      index: true,
    },
    sourceTitle: String,
    lookingFor: String,
    // Selected resource IDs from the initiator
    selectedResourceIds: [String],
    status: {
      type: String,
      enum: [
        "pending",
        "negotiation_started",
        "negotiation_active",
        "offer_sent",
        "counter_offered",
        "offer_accepted",
        "accepted",
        "meeting_scheduled",
        "resources_exchanged",
        "completed",
        "declined",
        "cancelled",
        "expired",
      ],
      default: "pending",
      index: true,
    },
    offeredItems: [
      {
        listingId: String,
        title: String,
        value: String,
        condition: String,
      },
    ],
    offeredValue: String,
    requestedValue: String,
    meetingLocation: String,
    meetingTime: Date,
    completedAt: Date,
    cancelledAt: Date,
    cancelReason: String,
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 48 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

// Compound index: prevent duplicate active sessions for same participants + source
exchangeSessionSchema.index(
  { initiatorId: 1, receiverId: 1, sourceType: 1, sourceId: 1 },
  { name: "unique_active_session_participants" }
);

export const ExchangeSession = mongoose.model("ExchangeSession", exchangeSessionSchema);

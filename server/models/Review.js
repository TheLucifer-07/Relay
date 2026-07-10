import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExchangeSession",
      index: true,
    },
    conversationId: String,
    tradeId: String,
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reviewerId: String,
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reviewedUserId: String,
    reviewerName: String,
    reviewerInitials: String,
    reviewerColor: String,
    starRating: { type: Number, required: true, min: 1, max: 5 },
    rating: Number,
    stars: String,
    title: String,
    description: { type: String, default: "" },
    comment: String,
    experience: String,
    tradeAgain: String,
    tags: [String],
    resource: String,
    tradeDate: String,
    accuracy: String,
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);

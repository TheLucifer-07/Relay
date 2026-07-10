import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true
    }
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness per user-listing bookmark
bookmarkSchema.index({ userId: 1, listingId: 1 }, { unique: true });

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

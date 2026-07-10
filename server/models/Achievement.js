import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "award" },
    unlockedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Achievement = mongoose.model("Achievement", achievementSchema);

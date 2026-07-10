import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    displayName: { type: String, required: true, trim: true },
    avatarUrl: String,
    avatarInitials: { type: String, default: "RU" },
    avatarColor: {
      type: String,
      default: "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]",
    },
    bio: String,
    city: String,
    location: String,
    latitude: Number,
    longitude: Number,
    phone: String,
    trustScore: { type: Number, default: 50, min: 0, max: 100 },
    successfulTrades: { type: Number, default: 0 },
    successRate: { type: String, default: "0%" },
    responseTime: { type: String, default: "30 min" },
    memberSince: { type: String, default: "" },
    preferences: {
      preference: { type: String, default: "Nearby only" },
      notificationsEnabled: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);

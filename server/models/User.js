import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      select: false,
    },
    provider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    providerId: String,
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isSeedUser: { type: Boolean, default: false },
    seedUserKey: { type: String, index: true, sparse: true },
    lastSeenAt: Date,
    refreshTokens: {
      type: [String],
      default: []
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (plain) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.hashPassword = async function (plain) {
  return bcrypt.hash(plain, 12);
};

export const User = mongoose.model("User", userSchema);

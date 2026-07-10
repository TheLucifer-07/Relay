import mongoose from "mongoose";

const lookingForDetailsSchema = new mongoose.Schema(
  {
    preferredCategories: [String],
    estimatedValue: String,
    conditionPreference: String,
    openToNegotiation: { type: Boolean, default: true },
    openToMultipleItems: { type: Boolean, default: false },
    nearbyOnly: { type: Boolean, default: true },
  },
  { _id: false }
);

const ownerProfileSchema = new mongoose.Schema(
  {
    initials: String,
    avatarColor: String,
    joinedSince: String,
    completedTrades: { type: Number, default: 0 },
    responseTime: String,
    tradeHistory: String,
    name: String,
  },
  { _id: false }
);

const listingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: [
        "Books", "Coupons", "Gift Cards", "Tools", "Electronics", "Furniture", 
        "Educational Kits", "Collectibles", "Reusable Resources", "Stationery", 
        "Home Appliances", "Sports", "Musical Instruments", "Vehicles", "Accessories", "More"
      ],
      required: true,
      index: true,
    },
    condition: {
      type: String,
      enum: ["Like New", "Excellent", "Good", "Fair", "Poor", "Unused"],
      default: "Good",
    },
    value: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Ready to Negotiate", "Urgent Trade", "Instant Trade", "In Negotiation", "Traded", "Archived"],
      default: "Ready to Negotiate",
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ["Pending", "AI Verified", "Manual Review", "Rejected"],
      default: "Pending",
    },
    availability: { type: String, default: "Available now" },
    lookingFor: { type: String, default: "" },
    lookingForDetails: lookingForDetailsSchema,
    ownerProfile: ownerProfileSchema,
    ownerName: String,
    badge: String,
    detailLabel: String,
    detailValue: String,
    quality: String,
    expiry: String,
    balanceRemaining: String,
    accessories: String,
    ownerNotes: String,
    distance: String,
    rating: { type: Number, default: 4.9 },
    verified: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false, index: true },
    viewCount: { type: Number, default: 0 },
    images: [String],
    latitude: Number,
    longitude: Number,
    city: String,
    isAuctionEligible: { type: Boolean, default: false },
    aiReport: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

listingSchema.index({ title: "text", description: "text", lookingFor: "text" });
listingSchema.index({ latitude: 1, longitude: 1 });
listingSchema.index({ createdAt: -1 });

export const Listing = mongoose.model("Listing", listingSchema);

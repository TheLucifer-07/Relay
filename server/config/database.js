import mongoose from "mongoose";
import { env } from "../config/env.js";
import { Category } from "../models/Category.js";
import { User } from "../models/User.js";
import { seedDatabase } from "../utils/seeder.js";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  if (!env.MONGODB_URI) {
    console.warn("⚠  MONGODB_URI not set — running without database.");
    return;
  }

  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log("✓  MongoDB connected");
    
    // Seed standard resources and auctions automatically
    void seedDatabase().then(async () => {
      try {
        await User.updateMany({ email: { $regex: /@relay\.demo$/ } }, { isSeedUser: true });
        console.log("✓  Demo seed users verified/tagged with isSeedUser: true");
      } catch (err) {
        console.error("✗  Failed to tag demo seed users:", err);
      }
    });

    // Seed default categories
    const categoriesToSeed = [
      "Books", "Coupons", "Gift Cards", "Tools", "Electronics", 
      "Furniture", "Educational Kits", "Collectibles", "Reusable Resources", "More"
    ];
    
    // Seed quietly in background
    Promise.allSettled(
      categoriesToSeed.map(name => 
        Category.findOneAndUpdate({ name }, { name }, { upsert: true, returnDocument: 'after' })
      )
    ).then(() => {
      console.log("✓  Categories seeded");
    }).catch(err => {
      console.error("✗  Failed to seed categories:", err);
    });

  } catch (error) {
    console.error("✗  MongoDB connection failed:", error.message);
  }
}

export function getConnectionState() {
  return isConnected;
}

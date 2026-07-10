import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(fileBuffer) {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY) {
    console.warn("Cloudinary credentials missing; using placeholder image.");
    return "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600";
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "relay_listings", resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    ).end(fileBuffer);
  });
}

import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(dir, "../../.env") });

const required = ["MONGODB_URI", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.warn(`\n⚠  Missing required environment variables: ${missing.join(", ")}`);
  console.warn("   Server will start but database features will be unavailable.\n");
}

export const env = {
  PORT: Number(process.env.PORT) || 4000,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  MONGODB_URI: process.env.MONGODB_URI || "",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "relay-dev-secret-change-in-production",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "relay-refresh-dev-secret-change-in-production",
  JWT_SECRET: process.env.JWT_SECRET || "relay-dev-secret-change-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || "",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  FROM_EMAIL: process.env.FROM_EMAIL || "noreply@relay.app",
};

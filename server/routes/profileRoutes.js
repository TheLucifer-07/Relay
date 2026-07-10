import express from "express";
import {
  getProfileByUserId,
  getPublicProfile,
  getUserListings,
  updateProfile,
  submitTraderFeedback
} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (no auth required)
router.get("/:userId/public", getPublicProfile);
router.get("/:userId/listings", getUserListings);

// Private / auth required
router.get("/:userId", getProfileByUserId);
router.patch("/:userId", protect, updateProfile);
router.post("/feedback", protect, submitTraderFeedback);

export default router;

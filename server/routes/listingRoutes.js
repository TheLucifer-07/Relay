import express from "express";
import multer from "multer";
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  analyzeListingDraft,
} from "../controllers/listingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/", getListings);
router.get("/:id", getListingById);
router.post("/", protect, createListing);
router.patch("/:id", protect, updateListing);
router.delete("/:id", protect, deleteListing);
router.post("/analyze", protect, upload.single("image"), analyzeListingDraft);

export default router;

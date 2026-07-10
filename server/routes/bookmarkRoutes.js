import express from "express";
import { getBookmarks, createBookmark, deleteBookmark } from "../controllers/bookmarkController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:userId", protect, getBookmarks);
router.post("/:userId", protect, createBookmark);
router.delete("/:userId/:listingId", protect, deleteBookmark);

export default router;

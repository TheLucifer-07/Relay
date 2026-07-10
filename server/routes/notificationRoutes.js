import express from "express";
import { getNotifications, updateNotification, markAllRead } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:userId", protect, getNotifications);
router.patch("/mark-all-read", protect, markAllRead);
router.patch("/:notificationId", protect, updateNotification);

export default router;

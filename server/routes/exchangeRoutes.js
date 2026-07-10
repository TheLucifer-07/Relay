import express from "express";
import {
  getExchangeSessions,
  createExchangeSession,
  updateSessionStatus,
  getMessages,
  sendMessage
} from "../controllers/exchangeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getExchangeSessions);
router.post("/", protect, createExchangeSession);
router.patch("/:sessionId/status", protect, updateSessionStatus);
router.get("/:sessionId/messages", protect, getMessages);
router.post("/:sessionId/messages", protect, sendMessage);

export default router;

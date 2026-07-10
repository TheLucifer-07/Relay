import express from "express";
import { getAuctions, createAuction, placeBid } from "../controllers/auctionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAuctions);
router.post("/", protect, createAuction);
router.post("/:auctionId/bid", protect, placeBid);

export default router;

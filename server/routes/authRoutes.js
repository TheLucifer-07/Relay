import express from "express";
import { signup, login, googleAuth, forgotPassword, ensureUser, refresh, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", signup);
router.post("/signup", signup); // Support both styles of mapping
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/forgot-password", forgotPassword);
router.post("/ensure-user", ensureUser);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;

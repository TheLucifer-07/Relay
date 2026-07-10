import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { connectDB } from "./config/database.js";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import exchangeRoutes from "./routes/exchangeRoutes.js";
import auctionRoutes from "./routes/auctionRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "relay-api" });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "relay-api" });
});

app.get("/api/config/google-maps-key", (_req, res) => {
  res.json({ apiKey: env.GOOGLE_MAPS_API_KEY });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/exchanges", exchangeRoutes);
app.use("/api/auctions", auctionRoutes);

app.use(express.static(path.join(__dirname, "../dist")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

// In-memory presence tracking: userId → Set of socketIds
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // ── Join private user room & broadcast online status ───────────────────
  socket.on("join-user", (userId) => {
    socket.join(userId);
    socket.data.userId = userId;

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Broadcast presence to everyone
    io.emit("user_online", { userId });
    console.log(`User ${userId} joined room (${onlineUsers.get(userId).size} sockets)`);
  });

  // ── Join a conversation room for targeted delivery ─────────────────────
  socket.on("join-session", (sessionId) => {
    socket.join(`session:${sessionId}`);
  });

  socket.on("leave-session", (sessionId) => {
    socket.leave(`session:${sessionId}`);
  });

  // ── Typing indicators ──────────────────────────────────────────────────
  socket.on("typing_start", ({ sessionId, userId }) => {
    socket.to(`session:${sessionId}`).emit("typing_start", { sessionId, userId });
  });

  socket.on("typing_stop", ({ sessionId, userId }) => {
    socket.to(`session:${sessionId}`).emit("typing_stop", { sessionId, userId });
  });

  // ── Read receipts — client notifies server that messages were read ──────
  socket.on("messages_read", ({ sessionId, readerId }) => {
    // Notify all other participants in the session room
    socket.to(`session:${sessionId}`).emit("messages_read", { sessionId, readerId });
  });

  // ── Disconnect: clean up presence ──────────────────────────────────────
  socket.on("disconnect", () => {
    const userId = socket.data.userId;
    if (userId && onlineUsers.has(userId)) {
      onlineUsers.get(userId).delete(socket.id);
      if (onlineUsers.get(userId).size === 0) {
        onlineUsers.delete(userId);
        const lastSeenAt = new Date().toISOString();
        // Broadcast offline + last-seen to everyone
        io.emit("user_offline", { userId, lastSeenAt });
      }
    }
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

async function start() {
  await connectDB();

  httpServer.listen(env.PORT, () => {
    console.log(`Relay API listening on port ${env.PORT}`);
  });
}

start();

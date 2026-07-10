import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Profile } from "../models/Profile.js";
import { env } from "../config/env.js";
import { seedUserDataForUser } from "../utils/seeder.js";

const AVATAR_COLORS = [
  "bg-[rgba(255,159,113,0.16)] text-[#ff9f71]",
  "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]",
  "bg-[rgba(255,199,91,0.16)] text-[#ffc75b]",
  "bg-[rgba(136,196,255,0.16)] text-[#88c4ff]",
  "bg-[rgba(187,147,255,0.18)] text-[#bb93ff]"
];

function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: "15m" // 15 minutes access token
  });
}

function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d" // 7 days refresh token
  });
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "RU";
}

function getRandomColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

function getMemberSince() {
  const date = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

export async function signup(req, res, next) {
  try {
    const emailStr = typeof req.body.email === "string" ? req.body.email.trim() : "";
    const passwordStr = typeof req.body.password === "string" ? req.body.password : "";
    const displayNameStr = typeof req.body.displayName === "string" ? req.body.displayName.trim() : "";

    if (!emailStr || !passwordStr || !displayNameStr) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(passwordStr)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      });
    }

    const existingUser = await User.findOne({ email: emailStr });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const passwordHash = await User.hashPassword(passwordStr);
    const user = await User.create({
      email: emailStr,
      passwordHash,
      provider: "email",
      lastSeenAt: new Date()
    });

    const initials = getInitials(displayNameStr);
    const avatarColor = getRandomColor();
    const memberSince = getMemberSince();

    const profile = await Profile.create({
      userId: user._id,
      displayName: displayNameStr,
      avatarInitials: initials,
      avatarColor,
      memberSince,
      city: "Visakhapatnam",
      trustScore: 95, // Starting score for new users
      successfulTrades: 0,
      successRate: "100%",
      responseTime: "10 min"
    });

    // Seed initial dashboard requests, notifications, and transactions for new account
    await seedUserDataForUser(user._id);

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens = [refreshToken];
    await user.save();

    return res.status(201).json({
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      },
      profile
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const emailStr = typeof req.body.email === "string" ? req.body.email.trim() : "";
    const passwordStr = typeof req.body.password === "string" ? req.body.password : "";

    if (!emailStr || !passwordStr) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email: emailStr }).select("+passwordHash");
    if (!user || !(await user.comparePassword(passwordStr))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    user.lastSeenAt = new Date();
    
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshTokens = [refreshToken];
    
    await user.save();

    await seedUserDataForUser(user._id);

    let profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      // Fallback in case profile doesn't exist
      profile = await Profile.create({
        userId: user._id,
        displayName: emailStr.split("@")[0],
        avatarInitials: "RU",
        avatarColor: "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]",
        memberSince: "Jan 2024"
      });
    }

    return res.json({
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      },
      profile
    });
  } catch (error) {
    next(error);
  }
}

export async function googleAuth(req, res, next) {
  try {
    const { email, displayName, photoURL, providerId } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required for sign-in" });
    }

    let user = await User.findOne({ email });
    let isNew = false;

    if (!user) {
      isNew = true;
      user = await User.create({
        email,
        provider: "google",
        providerId,
        isEmailVerified: true,
        lastSeenAt: new Date()
      });
    } else {
      user.lastSeenAt = new Date();
      await user.save();
    }

    let profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      const initials = getInitials(displayName || email.split("@")[0]);
      const avatarColor = getRandomColor();
      const memberSince = getMemberSince();

      profile = await Profile.create({
        userId: user._id,
        displayName: displayName || email.split("@")[0],
        avatarUrl: photoURL || "",
        avatarInitials: initials,
        avatarColor,
        memberSince,
        city: "Visakhapatnam",
        trustScore: 98,
        successfulTrades: 0,
        successRate: "100%",
        responseTime: "10 min"
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshTokens = [refreshToken];
    await user.save();

    return res.status(isNew ? 201 : 200).json({
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      },
      profile
    });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const emailStr = typeof req.body.email === "string" ? req.body.email.trim() : "";
    if (!emailStr) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email: emailStr });
    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    // In a production app, we would send a link. For now we will return a success.
    return res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    next(error);
  }
}

export async function ensureUser(req, res, next) {
  try {
    const emailStr = typeof req.body.email === "string" ? req.body.email.trim() : "";
    const displayNameStr = typeof req.body.displayName === "string" ? req.body.displayName.trim() : "";
    const photoUrlStr = typeof req.body.photoURL === "string" ? req.body.photoURL.trim() : "";
    const providerStr = typeof req.body.provider === "string" ? req.body.provider.trim() : "email";

    if (!emailStr) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email: emailStr });
    if (!user) {
      user = await User.create({
        email: emailStr,
        provider: providerStr,
        lastSeenAt: new Date()
      });
    } else {
      user.lastSeenAt = new Date();
      await user.save();
    }

    let profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      profile = await Profile.create({
        userId: user._id,
        displayName: displayNameStr || emailStr.split("@")[0],
        avatarUrl: photoUrlStr,
        avatarInitials: getInitials(displayNameStr || emailStr.split("@")[0]),
        avatarColor: getRandomColor(),
        memberSince: getMemberSince()
      });
      // Seed user-specific items on initial Google profile creation
      await seedUserDataForUser(user._id);
    }

    return res.json({ user, profile });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req, res, next) {
  try {
    const tokenStr = typeof req.body.refreshToken === "string" ? req.body.refreshToken : "";
    if (!tokenStr) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(tokenStr, env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Refresh token invalid or expired" });
    }

    const user = await User.findOne({ _id: decoded.id, refreshTokens: tokenStr });
    if (!user) {
      return res.status(401).json({ message: "Invalid session or token revoked" });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Rotate refresh token
    user.refreshTokens = user.refreshTokens.filter((t) => t !== tokenStr);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    const profile = await Profile.findOne({ userId: user._id });

    return res.json({
      token: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      },
      profile
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const tokenStr = typeof req.body.refreshToken === "string" ? req.body.refreshToken : "";
    if (tokenStr) {
      const user = await User.findOne({ refreshTokens: tokenStr });
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== tokenStr);
        await user.save();
      }
    }
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
}

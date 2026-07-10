import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

export async function protect(req, res, next) {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
      
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token invalid" });
    }
  } catch (error) {
    next(error);
  }
}

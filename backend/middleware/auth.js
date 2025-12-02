// backend/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "myVerySecretKey123!");

    // Fetch full user from DB to ensure it exists
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; 
    req.userId = user._id;

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

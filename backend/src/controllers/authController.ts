// backend/src/controllers/authController.ts
import { Request, Response } from "express";
import * as authModel from "../models/authModel.js";
import jwt from "jsonwebtoken";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await authModel.getUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    const validPassword = await authModel.verifyPassword(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: "Invalid password" });
    console.log("User from DB:", user);

    // Remove sensitive info
    const { password_hash, ...userSafe } = user;
    
console.log("User object before jwt.sign:", user);
    // 🔑 Generate a JWT token (valid 2 hours)
    const token = jwt.sign(
  {
    user_id: user.user_id,
    company_id: user.company_id,
    role_id: user.role_id,
  },
  process.env.JWT_SECRET!,
  { expiresIn: "2h" }
);

    res.json({ user: userSafe, token });
    console.log("Safe user sent to client:", userSafe);
  } catch (err) {
    console.error("❌ Error logging in:", err);
    res.status(500).json({ error: "Failed to login user" });
  }
};


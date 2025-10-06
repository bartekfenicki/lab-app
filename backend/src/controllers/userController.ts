import { Request, Response } from "express";
import * as userModel from "../models/usersModel.js";
import { AuthRequest } from "../middlewares/auth.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

// ✅ Create a user
export const createUser = async (req: Request, res: Response) => {
  try {
    console.log("Request body:", req.body);
    const user = await userModel.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error("❌ Error creating user:", err, userModel, req.body);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// ✅ Get all users
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};



// ✅ Get single user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userModel.getUserById(Number(req.params.id));
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// ✅ Update user
export const updateUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updates: any = { ...req.body };

  try {
    // ✅ Handle password hashing
    if (updates.password_hash) {
      updates.password_hash = await bcrypt.hash(updates.password_hash, 10);
    }

    // ✅ Handle profile picture if file is uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updates.profilepic = result.secure_url;
    }

    const updatedUser = await userModel.updateUser(id, updates);
    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    // Remove sensitive info before returning
    const { password_hash, ...safeUser } = updatedUser;
    res.json(safeUser);
  } catch (err) {
    console.error("❌ Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// ✅ Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const success = await userModel.deleteUser(Number(req.params.id));
    if (!success) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

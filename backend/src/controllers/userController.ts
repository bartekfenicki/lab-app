import { Request, Response } from "express";
import * as userModel from "../models/usersModel.js";


// ✅ Create a user
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userModel.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error("❌ Error creating user:", err);
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
  try {
    const updatedUser = await userModel.updateUser(Number(req.params.id), req.body);
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json(updatedUser);
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

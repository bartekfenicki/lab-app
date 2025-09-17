import { Request, Response } from "express";
import * as roleModel from "../models/roleModel.js";


// ✅ Create a role
export const createRole = async (req: Request, res: Response) => {
  try {
    const role = await roleModel.createRole(req.body);
    res.status(201).json(role);
  } catch (err) {
    console.error("❌ Error creating role:", err);
    res.status(500).json({ error: "Failed to create role" });
  }
};

// ✅ Get all users
export const getRoles = async (_req: Request, res: Response) => {
  try {
    const users = await roleModel.getAllRoles();
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ✅ Get single role by ID
export const getRoleById = async (req: Request, res: Response) => {
  try {
    const role = await roleModel.getRoleById(Number(req.params.id));
    if (!role) return res.status(404).json({ error: "Role not found" });
    res.json(role);
  } catch (err) {
    console.error("❌ Error fetching role:", err);
    res.status(500).json({ error: "Failed to fetch role" });
  }
};

// ✅ Update role
export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedRole = await roleModel.updateRole(Number(req.params.id), req.body);
    if (!updatedRole) return res.status(404).json({ error: "role not found" });
    res.json(updatedRole);
  } catch (err) {
    console.error("❌ Error updating role:", err);
    res.status(500).json({ error: "Failed to update role" });
  }
};

// ✅ Delete Role
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const success = await roleModel.deleteRole(Number(req.params.id));
    if (!success) return res.status(404).json({ error: "Role not found" });
    res.json({ message: "Role deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting Role:", err);
    res.status(500).json({ error: "Failed to delete Role" });
  }
};
import { Request, Response } from "express";
import * as availabilityModel from "../models/availabilityModel.js";

// Create
export const createAvailability = async (req: Request, res: Response) => {
  try {
    const availability = await availabilityModel.createAvailability(req.body);
    res.status(201).json(availability);
  } catch (err) {
    console.error("❌ Error creating availability:", err);
    res.status(500).json({ error: "Failed to create availability" });
  }
};

// Get all for a user
export const getAvailabilityByUser = async (req: Request, res: Response) => {
  try {
    const user_id = Number(req.params.id);
    const availability = await availabilityModel.getAvailabilityByUser(user_id);
    res.json(availability);
  } catch (err) {
    console.error("❌ Error fetching availability:", err);
    res.status(500).json({ error: "Failed to fetch availability" });
  }
};

// Get single
export const getAvailabilityById = async (req: Request, res: Response) => {
  try {
    const availability = await availabilityModel.getAvailabilityById(Number(req.params.id));
    if (!availability) return res.status(404).json({ error: "Availability not found" });
    res.json(availability);
  } catch (err) {
    console.error("❌ Error fetching availability:", err);
    res.status(500).json({ error: "Failed to fetch availability" });
  }
};

export const upsertAvailability = async (req: Request, res: Response) => {
  try {
    const { user_id, date, status, note } = req.body;
    const result = await availabilityModel.upsertAvailability(user_id, date, status, note);
    res.json(result);
  } catch (err) {
    console.error("❌ Error upserting availability:", err);
    res.status(500).json({ error: "Failed to upsert availability" });
  }
};

// Update
export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const updated = await availabilityModel.updateAvailability(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: "Availability not found" });
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating availability:", err);
    res.status(500).json({ error: "Failed to update availability" });
  }
};

// Delete
export const deleteAvailability = async (req: Request, res: Response) => {
  try {
    const success = await availabilityModel.deleteAvailability(Number(req.params.id));
    if (!success) return res.status(404).json({ error: "Availability not found" });
    res.json({ message: "Availability deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting availability:", err);
    res.status(500).json({ error: "Failed to delete availability" });
  }
};

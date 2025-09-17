import { Request, Response } from "express";
import * as shiftModel from "../models/shiftsModel.js";

// Create a shift
export const createShift = async (req: Request, res: Response) => {
  try {
    const shift = await shiftModel.createShift(req.body);
    res.status(201).json(shift);
  } catch (err) {
    console.error("❌ Error creating shift:", err);
    res.status(500).json({ error: "Failed to create shift" });
  }
};

// Get all shifts
export const getShifts = async (_req: Request, res: Response) => {
  try {
    const shifts = await shiftModel.getAllShifts();
    res.json(shifts);
  } catch (err) {
    console.error("❌ Error fetching shifts:", err);
    res.status(500).json({ error: "Failed to fetch shifts" });
  }
};

// Get shift by ID
export const getShiftById = async (req: Request, res: Response) => {
  try {
    const shift = await shiftModel.getShiftById(Number(req.params.id));
    if (!shift) return res.status(404).json({ error: "Shift not found" });
    res.json(shift);
  } catch (err) {
    console.error("❌ Error fetching shift:", err);
    res.status(500).json({ error: "Failed to fetch shift" });
  }
};

// Update shift (e.g., start_time, end_time, approved_by, status)
export const updateShift = async (req: Request, res: Response) => {
  try {
    const updatedShift = await shiftModel.updateShift(Number(req.params.id), req.body);
    if (!updatedShift) return res.status(404).json({ error: "Shift not found" });
    res.json(updatedShift);
  } catch (err) {
    console.error("❌ Error updating shift:", err);
    res.status(500).json({ error: "Failed to update shift" });
  }
};

// Start shift
export const startShift = async (req: Request, res: Response) => {
  try {
    const shift = await shiftModel.startShift(Number(req.params.id));
    if (!shift) return res.status(400).json({ error: "Shift cannot be started" });
    res.json(shift);
  } catch (err) {
    console.error("❌ Error starting shift:", err);
    res.status(500).json({ error: "Failed to start shift" });
  }
};

// End shift
export const endShift = async (req: Request, res: Response) => {
  try {
    const shift = await shiftModel.endShift(Number(req.params.id));
    if (!shift) return res.status(400).json({ error: "Shift cannot be ended" });
    res.json(shift);
  } catch (err) {
    console.error("❌ Error ending shift:", err);
    res.status(500).json({ error: "Failed to end shift" });
  }
};


// Delete shift
export const deleteShift = async (req: Request, res: Response) => {
  try {
    const success = await shiftModel.deleteShift(Number(req.params.id));
    if (!success) return res.status(404).json({ error: "Shift not found" });
    res.json({ message: "Shift deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting shift:", err);
    res.status(500).json({ error: "Failed to delete shift" });
  }
};

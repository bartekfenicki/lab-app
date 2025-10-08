import { Request, Response } from "express";
import {
  createShift,
  getCompanyShifts,
  approveShift,
  startShift,
  endShift,
  deleteShift,
  getShiftById,
  updateShift,
} from "../models/shiftsModel.js";
import { pool } from "../config/db.js";

// ➕ Create new shift
export const createShiftController = async (req: Request, res: Response) => {
  try {
    const { user_id, date, assigned_start_time, assigned_end_time, status } = req.body;

    // Fetch company_id and role_id for selected user
    const userResult = await pool.query(
      `SELECT company_id, role_id FROM users WHERE user_id = $1`,
      [user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { company_id, role_id } = userResult.rows[0];

    const startTimestamp = new Date(`${date}T${assigned_start_time}:00`);
    const endTimestamp = new Date(`${date}T${assigned_end_time}:00`);

    // ✅ Create shift with proper timestamps
    const newShift = await createShift({
      company_id,
      role_id,
      user_id,
      date,
      assigned_start_time: startTimestamp.toISOString(),
      assigned_end_time: endTimestamp.toISOString(),
      status,
    });

    res.status(201).json(newShift);
  } catch (error: any) {
    console.error("Error creating shift:", error);
    res.status(500).json({ message: "Failed to create shift", error: error.message });
  }
};

// 📄 Get all shifts for company
export const getCompanyShiftsController = async (req: Request, res: Response) => {
  try {
    const company_id = parseInt(req.params.company_id);
    const shifts = await getCompanyShifts(company_id);
    res.status(200).json(shifts);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch shifts", error: error.message });
  }
};

// ✅ Approve shift
export const approveShiftController = async (req: Request, res: Response) => {
  try {
    const shift_id = Number(req.params.id);
    const approved_by = Number(req.body.approved_by); 
    if (isNaN(shift_id) || isNaN(approved_by)) {
      return res.status(400).json({ message: "Invalid shift_id or approved_by" });
    }
    const shift = await approveShift(shift_id, approved_by);
    res.status(200).json(shift);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to approve shift", error: error.message });
  }
};

// ▶️ Start shift (clock-in)
export const startShiftController = async (req: Request, res: Response) => {
  try {
    const shift_id = Number(req.params.id); // ✅ match route
    if (isNaN(shift_id)) {
      return res.status(400).json({ message: "Invalid shift ID" });
    }
    const shift = await startShift(shift_id);
    res.status(200).json(shift);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to start shift", error: error.message });
  }
};

// ⏹️ End shift (clock-out)
export const endShiftController = async (req: Request, res: Response) => {
  try {
    const shift_id = Number(req.params.id); // ✅ match route
    if (isNaN(shift_id)) {
      return res.status(400).json({ message: "Invalid shift ID" });
    }
    const shift = await endShift(shift_id);
    res.status(200).json(shift);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to end shift", error: error.message });
  }
};

export const getShiftByIdController = async (req: Request, res: Response) => {
  try {
    const shift_id = Number(req.params.id); // ✅ match route
    if (isNaN(shift_id)) {
      return res.status(400).json({ message: "Invalid shift ID" });
    }
    const shift = await getShiftById(shift_id);
    if (!shift) return res.status(404).json({ message: "Shift not found" });
    res.status(200).json(shift);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch shift", error: error.message });
  }
};

export const deleteShiftController = async (req: Request, res: Response) => {
  try {
    const shift_id = parseInt(req.params.shift_id);
    const result = await deleteShift(shift_id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to delete shift", error: error.message });
  }
};

export const updateShiftController = async (req: Request, res: Response) => {
  try {
    const shift_id = parseInt(req.params.shift_id);
    const updatedFields = req.body;

    const updatedShift = await updateShift(shift_id, updatedFields);

    if (!updatedShift) {
      return res.status(404).json({ message: "Shift not found or no fields to update" });
    }

    res.status(200).json(updatedShift);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update shift", error: error.message });
  }
};

export { createShift };


import { Request, Response } from "express";
import * as hoursModel from "../models/hoursModel.js";

// Get monthly summary
export const getMonthlyHours = async (req: Request, res: Response) => {
  const user_id = Number(req.params.user_id);
  const month = req.params.month; // "YYYY-MM"

  try {
    // Recalculate hours dynamically
    const hours = await hoursModel.recalculateMonthlyHours(user_id, month);
    res.json(hours);
  } catch (err) {
    console.error("❌ Error fetching monthly hours:", err);
    res.status(500).json({ error: "Failed to fetch hours" });
  }
};

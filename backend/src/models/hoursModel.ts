import { pool } from "../config/db.js";

export interface Hours {
  hours_id?: number;
  user_id: number;
  month: string;
  total_hours?: number;     // all shifts, completed or pending
  approved_hours?: number;  // only approved shifts
}

// Get monthly summary
export const getMonthlyHours = async (user_id: number, month: string): Promise<Hours | null> => {
  const result = await pool.query(
    `SELECT * FROM hours WHERE user_id = $1 AND month = $2`,
    [user_id, month]
  );
  return result.rows[0] || null;
};

// Create monthly record
export const createMonthlyHours = async (hours: Hours): Promise<Hours> => {
  const result = await pool.query(
    `INSERT INTO hours (user_id, month, total_hours, approved_hours)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [hours.user_id, hours.month, hours.total_hours || 0, hours.approved_hours || 0]
  );
  return result.rows[0];
};

// Update monthly hours
export const updateMonthlyHours = async (user_id: number, month: string, total: number, approved: number): Promise<Hours> => {
  const result = await pool.query(
    `UPDATE hours
     SET total_hours = $3, approved_hours = $4
     WHERE user_id = $1 AND month = $2
     RETURNING *`,
    [user_id, month, total, approved]
  );
  return result.rows[0] || null;
};

// Recalculate total and approved hours from shifts
export const recalculateMonthlyHours = async (user_id: number, month: string): Promise<Hours> => {
  const totalResult = await pool.query(
    `SELECT SUM(EXTRACT(EPOCH FROM (end_time - start_time))/3600) AS total_hours
     FROM shifts
     WHERE user_id = $1 AND DATE_TRUNC('month', date) = $2`,
    [user_id, `${month}-01`]
  );

  const approvedResult = await pool.query(
    `SELECT SUM(EXTRACT(EPOCH FROM (end_time - start_time))/3600) AS approved_hours
     FROM shifts
     WHERE user_id = $1 AND status = 'approved' AND DATE_TRUNC('month', date) = $2`,
    [user_id, `${month}-01`]
  );

  const total_hours = totalResult.rows[0].total_hours || 0;
  const approved_hours = approvedResult.rows[0].approved_hours || 0;

  // Update or create monthly record
  let hours = await getMonthlyHours(user_id, month);
  if (hours) {
    hours = await updateMonthlyHours(user_id, month, total_hours, approved_hours);
  } else {
    hours = await createMonthlyHours({ user_id, month, total_hours, approved_hours });
  }

  return hours;
};

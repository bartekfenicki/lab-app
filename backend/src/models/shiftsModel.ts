import { pool } from "../config/db.js";

export interface Shift {
  shift_id?: number;
  company_id: number;
  role_id: number;
  user_id: number;
  date: Date;
  assigned_start_time: string;
  assigned_end_time: string;
  start_time?: string | null;
  end_time?: string | null;
  approved_by?: number | null;
  status: string; // e.g., "upcoming", "waiting_approval", "approved", "completed"
}

// ✅ Create a new shift
export const createShift = async (shift: Shift): Promise<Shift> => {
  const result = await pool.query(
    `INSERT INTO shift 
      (company_id, role_id, user_id, date, assigned_start_time, assigned_end_time, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      shift.company_id,
      shift.role_id,
      shift.user_id,
      shift.date,
      shift.assigned_start_time,
      shift.assigned_end_time,
      shift.status,
    ]
  );
  return result.rows[0];
};

// ✅ Get all shifts for a company
export const getCompanyShifts = async (company_id: number): Promise<Shift[]> => {
  const result = await pool.query(
    `SELECT * FROM shift WHERE company_id = $1 ORDER BY date ASC`,
    [company_id]
  );
  return result.rows;
};

// ✅ Approve a shift
export const approveShift = async (
  shift_id: number,
  approved_by: number
): Promise<Shift> => {
  const result = await pool.query(
    `UPDATE shift
     SET status = 'approved', approved_by = $2, updated_at = NOW()
     WHERE shift_id = $1
     RETURNING *`,
    [shift_id, approved_by]
  );
  return result.rows[0];
};

// ✅ Record actual start time (clock-in)
export const startShift = async (shift_id: number): Promise<Shift> => {
  const result = await pool.query(
    `UPDATE shift
     SET start_time = NOW(), status = 'in_progress', updated_at = NOW()
     WHERE shift_id = $1
     RETURNING *`,
    [shift_id]
  );
  return result.rows[0];
};

// ✅ Record actual end time (clock-out)
export const endShift = async (shift_id: number): Promise<Shift> => {
  const result = await pool.query(
    `UPDATE shift
     SET end_time = NOW(), status = 'pending_approval', updated_at = NOW()
     WHERE shift_id = $1
     RETURNING *`,
    [shift_id]
  );
  return result.rows[0];
};

export const getShiftById = async (shift_id: number): Promise<Shift | null> => {
  const result = await pool.query(
    `SELECT * FROM shift WHERE shift_id = $1`,
    [shift_id]
  );
  return result.rows[0] || null;
};

export const deleteShift = async (shift_id: number): Promise<{ message: string }> => {
  const result = await pool.query(
    `DELETE FROM shift WHERE shift_id = $1`,
    [shift_id]
  );
  if (result.rowCount === 0) {
    return { message: "Shift not found or already deleted" };
  }
  return { message: "Shift deleted successfully" };
};

// ✅ Update a shift
export const updateShift = async (
  shift_id: number,
  updatedFields: Partial<Shift>
): Promise<Shift | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let index = 1;

  // Build dynamic query based on fields provided
  for (const key in updatedFields) {
    if (updatedFields.hasOwnProperty(key) && key !== "shift_id" && key !== "start_time" && key !== "end_time") {
      fields.push(`${key} = $${index}`);
      values.push((updatedFields as any)[key]);
      index++;
    }
  }

  if (fields.length === 0) return null;

  values.push(shift_id); // last parameter is shift_id

  const query = `
    UPDATE shift
    SET ${fields.join(", ")}, updated_at = NOW()
    WHERE shift_id = $${index}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};


import { pool } from "../config/db.js";

export interface Shift {
  shift_id?: number;
  role_id: number;
  user_id: number;
  date: Date;
  start_time?: string;
  end_time?: string;
  approved_by?: number;
  status: string; // e.g., "pending", "approved", "completed"
}

// ✅ Create a new shift
export const createShift = async (shift: Shift): Promise<Shift> => {
  const result = await pool.query(
    `INSERT INTO shift (role_id, user_id, date, status)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [shift.role_id, shift.user_id, shift.date, shift.status]
  );
  return result.rows[0];
};

// ✅ Get all shifts
export const getAllShifts = async (): Promise<Shift[]> => {
  const result = await pool.query(`SELECT * FROM shift`);
  return result.rows;
};

// ✅ Get shift by ID
export const getShiftById = async (id: number): Promise<Shift | null> => {
  const result = await pool.query(`SELECT * FROM shift WHERE shift_id = $1`, [id]);
  return result.rows[0] || null;
};

// ✅ Update a shift
export const updateShift = async (id: number, shift: Partial<Shift>): Promise<Shift | null> => {
  const fields = [];
  const values = [];
  let idx = 1;

  for (const key in shift) {
    fields.push(`${key} = $${idx}`);
    // @ts-ignore
    values.push(shift[key]);
    idx++;
  }

  if (fields.length === 0) return null;

  values.push(id);
  const query = `UPDATE shift SET ${fields.join(", ")} WHERE shift_id = $${idx} RETURNING *`;
  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

// Start a shift
export const startShift = async (id: number): Promise<Shift | null> => {
  const result = await pool.query(
    `UPDATE shift 
     SET start_time = NOW(), status = 'in_progress'
     WHERE shift_id = $1 AND start_time IS NULL
     RETURNING *`,
    [id]
  );
  return result.rows[0] || null;
};

// End a shift
export const endShift = async (id: number): Promise<Shift | null> => {
  const result = await pool.query(
    `UPDATE shift 
     SET end_time = NOW(), status = 'completed'
     WHERE shift_id = $1 AND start_time IS NOT NULL AND end_time IS NULL
     RETURNING *`,
    [id]
  );
  return result.rows[0] || null;
};


// ✅ Delete shift
export const deleteShift = async (id: number): Promise<boolean> => {
  const result = await pool.query(`DELETE FROM shift WHERE shift_id = $1`, [id]);
  return result.rowCount! > 0;
};

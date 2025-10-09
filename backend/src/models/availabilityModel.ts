import { pool } from "../config/db.js";

export interface Availability {
  availability_id?: number;
  user_id: number;
  date: Date;
  status: string;
  note?: string;
}

// Create new availability
export const createAvailability = async (availability: Availability) => {
  const result = await pool.query(
    `INSERT INTO availability (user_id, date, status, note)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [availability.user_id, availability.date, availability.status, availability.note || null]
  );
  return result.rows[0];
};

// Get all availability for a user
export const getAvailabilityByUser = async (user_id: number) => {
  const result = await pool.query(
    `SELECT 
       availability_id,
       user_id,
       TO_CHAR(date, 'YYYY-MM-DD') AS date,
       status,
       note
     FROM availability
     WHERE user_id = $1
     ORDER BY date ASC`,
    [user_id]
  );
  return result.rows;
};

// Get single availability by ID
export const getAvailabilityById = async (id: number) => {
  const result = await pool.query(
    `SELECT * FROM availability WHERE availability_id = $1`,
    [id]
  );
  return result.rows[0];
};

// Update availability
export const updateAvailability = async (id: number, availability: Partial<Availability>) => {
  const result = await pool.query(
    `UPDATE availability
     SET date = COALESCE($2, date),
         status = COALESCE($3, status),
         note = COALESCE($4, note)
     WHERE availability_id = $1
     RETURNING *`,
    [id, availability.date, availability.status, availability.note]
  );
  return result.rows[0];
};

// Delete availability
export const deleteAvailability = async (id: number) => {
  const result = await pool.query(
    `DELETE FROM availability WHERE availability_id = $1`,
    [id]
  );
  return result.rowCount! > 0;
};

export const upsertAvailability = async (
  user_id: number,
  date: string, // ✅ keep as string, not Date
  status: string,
  note?: string
) => {
  // Ensure we only pass pure date text
  const formattedDate = date.split("T")[0]; // In case frontend sends ISO string

  const existing = await pool.query(
    `SELECT * FROM availability WHERE user_id = $1 AND date::date = $2::date`,
    [user_id, formattedDate]
  );

  if (existing.rows.length > 0) {
    const updated = await pool.query(
      `UPDATE availability
       SET status = $1, note = COALESCE($2, note)
       WHERE availability_id = $3
       RETURNING 
         availability_id,
         user_id,
         TO_CHAR(date, 'YYYY-MM-DD') AS date,
         status,
         note`,
      [status, note || null, existing.rows[0].availability_id]
    );
    return updated.rows[0];
  } else {
    const created = await pool.query(
      `INSERT INTO availability (user_id, date, status, note)
       VALUES ($1, $2::date, $3, $4)
       RETURNING 
         availability_id,
         user_id,
         TO_CHAR(date, 'YYYY-MM-DD') AS date,
         status,
         note`,
      [user_id, formattedDate, status, note || null]
    );
    return created.rows[0];
  }
};


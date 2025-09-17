import { pool } from "../config/db.js";

export interface Event {
    event_id: number;
    created_by: number;
    title: string;
    description: string;
    date: Date;
    created_at: Date;
    image: string;
    time_start: string;
    time_end: string;
}

// ✅ Create a new event
export const createEvent = async (event: Partial<Event>): Promise<Event> => {
  const { created_by, title, description, date, image } = event;
  const result = await pool.query(
    `INSERT INTO event (created_by, title, description, date, image, time_start, time_end) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [created_by, title, description, date, image]
  );
  return result.rows[0];
};

// ✅ Get all events
export const getAllEvents = async (): Promise<Event[]> => {
  const result = await pool.query("SELECT * FROM event ORDER BY created_at ASC");
  return result.rows;
};

// ✅ Get single event by ID
export const getEventById = async (id: number): Promise<Event | null> => {
  const result = await pool.query("SELECT * FROM event WHERE event_id = $1", [id]);
  return result.rows[0] || null;
};

// ✅ Update an event
export const updateEvent = async (
  id: number,
  event: Partial<Event>
): Promise<Event | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const key in event) {
    fields.push(`${key} = $${idx}`);
    values.push((event as any)[key]);
    idx++;
  }

  if (fields.length === 0) return null; // nothing to update

  values.push(id);
  const query = `UPDATE event SET ${fields.join(", ")} WHERE event_id = $${idx} RETURNING *`;
  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

// ✅ Delete an event
export const deleteEvent = async (id: number): Promise<boolean> => {
  const result = await pool.query("DELETE FROM event WHERE event_id = $1", [id]);
  return result.rowCount! > 0;
};
import { pool } from "../config/db.js";

export interface Event {
  event_id?: number;
  created_by: number;
  company_id: number;
  title: string;
  description: string;
  date: Date;          // the day of the event
  event_start: Date;   // time when the event starts (timestamp)
  event_end: Date;     // time when the event ends (timestamp)
  created_at?: Date;
  image?: string;
  assigned_users: {
    user_id: number;
    first_name: string;
    last_name: string;
    profilepic?: string;
  }[];
}

// ✅ Create a new event
export const createEvent = async (event: Partial<Event>): Promise<Event> => {
  const { created_by, company_id, title, description, date, event_start, event_end, image } = event;

  const result = await pool.query(
    `INSERT INTO event (created_by, company_id, title, description, date, event_start, event_end, image)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [created_by, company_id, title, description, date, event_start, event_end, image || null]
  );

  return result.rows[0];
};

// ✅ Get all events
export const getAllEvents = async (): Promise<Event[]> => {
  const result = await pool.query("SELECT * FROM event ORDER BY date ASC");
  return result.rows;
};

// models/eventsModel.ts
export const getEventsByCompany = async (company_id: number): Promise<any[]> => {
  const result = await pool.query(
    `
    SELECT
      e.*,
      json_build_object(
        'user_id', poster.user_id,
        'first_name', poster.first_name,
        'last_name', poster.last_name
      ) AS created_by_user,
      COALESCE((
        SELECT json_agg(json_build_object(
          'user_id', u.user_id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'profilepic', u.profilepic
        ))
        FROM event_users eu
        JOIN users u ON eu.user_id = u.user_id
        WHERE eu.event_id = e.event_id
      ), '[]'::json) AS assigned_users
    FROM event e
    JOIN users poster ON e.created_by = poster.user_id
    WHERE e.company_id = $1
    ORDER BY e.date DESC;
    `,
    [company_id]
  );

  // Normalize rows: ensure assigned_users is always an array
  const rows = result.rows.map((r: any) => {
    let assigned = r.assigned_users;
    if (assigned == null) {
      assigned = [];
    } else if (typeof assigned === "string") {
      try {
        assigned = JSON.parse(assigned);
      } catch (err) {
        assigned = [];
      }
    }
    return {
      ...r,
      assigned_users: Array.isArray(assigned) ? assigned : [],
    };
  });

  // helpful debug — remove later
  console.log(
    "getEventsByCompany -> rows:",
    rows.map((r: any) => ({
      event_id: r.event_id,
      title: r.title,
      assigned_count: (r.assigned_users || []).length,
    }))
  );

  return rows;
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

export const assignUsersToEvent = async (event_id: number, userIds: number[]) => {
  if (!userIds || userIds.length === 0) return;

  const values = userIds.map((id, idx) => `(${event_id}, $${idx + 1})`).join(", ");
  await pool.query(
    `INSERT INTO event_users (event_id, user_id) VALUES ${values} ON CONFLICT DO NOTHING`,
    userIds
  );
};

// Fetch events with attached users
export const getEventWithUsers = async () => {
  const result = await pool.query(`
    SELECT e.*, u.user_id AS poster_id, u.first_name AS poster_first, u.last_name AS poster_last,
           eu.user_id AS assigned_user_id, u2.first_name AS assigned_first, u2.last_name AS assigned_last
    FROM event e
    JOIN users u ON e.created_by = u.user_id
    LEFT JOIN event_users eu ON e.event_id = eu.event_id
    LEFT JOIN users u2 ON eu.user_id = u2.user_id
    ORDER BY e.created_at DESC
  `);

  // Transform rows to nested structure
  const eventsMap = new Map<number, any>();
  result.rows.forEach((row) => {
    if (!eventsMap.has(row.event_id)) {
      eventsMap.set(row.event_id, {
        event_id: row.event_id,
        title: row.title,
        description: row.description,
        date: row.date,
        event_start: row.event_start,
        event_end: row.event_end,
        image: row.image,
        poster: { user_id: row.poster_id, first_name: row.poster_first, last_name: row.poster_last },
        assigned_users: [],
      });
    }
    if (row.assigned_user_id) {
      eventsMap.get(row.event_id).assigned_users.push({
        user_id: row.assigned_user_id,
        first_name: row.assigned_first,
        last_name: row.assigned_last,
      });
    }
  });

  return Array.from(eventsMap.values());
};
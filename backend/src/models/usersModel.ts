import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
export interface User {
  user_id?: number;
  company_id: number;
  role_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  phone?: string;
  email_verified: boolean;
  profilepic?: string;
}


// ✅ Create user
export const createUser = async (user: Omit<User, "user_id">): Promise<User> => {
  try {
    const hashedPassword = await bcrypt.hash(user.password_hash, 10);
    const columns = [
      "company_id", 
      "role_id", 
      "first_name", 
      "last_name", 
      "email", 
      "password_hash", 
      "phone", 
      "email_verified",
      "profilepic"
    ];

    const values = [
      user.company_id,
      user.role_id,
      user.first_name,
      user.last_name,
      user.email,
      hashedPassword,
      user.phone,
      user.email_verified || false,
      user.profilepic || null
    ];

   const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

   const query = `INSERT INTO users (${columns.join(", ")})
               VALUES (${placeholders})
               RETURNING *`;

    const result = await pool.query<User>(query, values);

    console.log("Inserted user:", result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error("❌ Error in createUser:", err);
    throw err;
  }
};

// ✅ Get all users
export const getAllUsers = async (): Promise<User[]> => {
  const result = await pool.query<User>("SELECT * FROM users ORDER BY user_id DESC");
  return result.rows;
};

// ✅ Get user by ID
export const getUserById = async (id: number): Promise<User | null> => {
  const result = await pool.query<User>("SELECT * FROM users WHERE user_id = $1", [id]);
  return result.rows[0] || null;
};

// ✅ Update user
export const updateUser = async (id: number, fields: Partial<User>): Promise<User | null> => {
  const keys = Object.keys(fields);
  if (keys.length === 0) return getUserById(id);

  const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");
  const values = Object.values(fields);

  const result = await pool.query<User>(
    `UPDATE users SET ${setClause} WHERE user_id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );

  return result.rows[0] || null;
};

// ✅ Delete user
export const deleteUser = async (id: number): Promise<boolean> => {
  const result = await pool.query("DELETE FROM users WHERE user_id = $1", [id]);
  return !!result.rowCount && result.rowCount > 0;
};

import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import { User } from "./usersModel.js";



export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query<User>("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] || null;
};

export const verifyPassword = async (plain: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};

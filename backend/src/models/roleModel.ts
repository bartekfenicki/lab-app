import { pool } from "../config/db.js";

export interface Role {
    role_id: number;
    company_id: number;
    name: string;
    created_at: Date;
    permissions: string;
}

export const createRole = async(role: Omit<Role, "role_id" | "created_at">): Promise<Role> => {
const result = await pool.query<Role>(
    `INSERT INTO role (company_id, name, permissions)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [
      role.company_id,
      role.name,
      role.permissions,
    ]
  );
  return result.rows[0];
};

// ✅ Get all roles
export const getAllRoles = async (): Promise<Role[]> => {
  const result = await pool.query<Role>("SELECT * FROM role ORDER BY created_at DESC");
  return result.rows;
};

// ✅ Get role by ID
export const getRoleById = async (id: number): Promise<Role | null> => {
  const result = await pool.query<Role>("SELECT * FROM role WHERE user_id = $1", [id]);
  return result.rows[0] || null;
};

// ✅ Get roles by company_id
export const getRolesByCompanyId = async (companyId: number): Promise<Role[]> => {
  const result = await pool.query<Role>(
    "SELECT * FROM role WHERE company_id = $1 ORDER BY created_at DESC",
    [companyId]
  );
  return result.rows;
};

// ✅ Update role
export const updateRole = async (id: number, fields: Partial<Role>): Promise<Role | null> => {
  const keys = Object.keys(fields);
  if (keys.length === 0) return getRoleById(id);

  const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");
  const values = Object.values(fields);

  const result = await pool.query<Role>(
    `UPDATE role SET ${setClause} WHERE role_id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );

  return result.rows[0] || null;
};

// ✅ Delete user
export const deleteRole = async (id: number): Promise<boolean> => {
  const result = await pool.query("DELETE FROM role WHERE role_id = $1", [id]);
  return !!result.rowCount && result.rowCount > 0;
};
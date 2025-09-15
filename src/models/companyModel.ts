import { pool } from "../config/db";

export interface Company {
  company_id?: number;
  name: string;
  tax_id: string;
  industry_type?: string;
  email: string;
  phone?: string;
  headquarters_address?: string;
  logo?: string;
  subscription_key?: string;
  created_at?: Date;
}

// Get all companies
export const getAllCompanies = async (): Promise<Company[]> => {
  const result = await pool.query("SELECT * FROM company ORDER BY company_id ASC");
  return result.rows;
};

// Get company by ID
export const getCompanyById = async (id: number): Promise<Company | null> => {
  const result = await pool.query("SELECT * FROM company WHERE company_id = $1", [id]);
  return result.rows[0] || null;
};

// Create company
export const createCompany = async (company: Company): Promise<Company> => {
  const result = await pool.query(
    `INSERT INTO company (name, tax_id, industry_type, email, phone, headquarters_address, logo, subscription_key)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      company.name,
      company.tax_id,
      company.industry_type,
      company.email,
      company.phone,
      company.headquarters_address,
      company.logo,
      company.subscription_key,
    ]
  );
  return result.rows[0];
};

// Update company
export const updateCompany = async (id: number, company: Partial<Company>): Promise<Company | null> => {
  const result = await pool.query(
    `UPDATE company SET 
      name = COALESCE($1, name),
      tax_id = COALESCE($2, tax_id),
      industry_type = COALESCE($3, industry_type),
      email = COALESCE($4, email),
      phone = COALESCE($5, phone),
      headquarters_address = COALESCE($6, headquarters_address),
      logo = COALESCE($7, logo),
      subscription_key = COALESCE($8, subscription_key)
     WHERE company_id = $9
     RETURNING *`,
    [
      company.name,
      company.tax_id,
      company.industry_type,
      company.email,
      company.phone,
      company.headquarters_address,
      company.logo,
      company.subscription_key,
      id,
    ]
  );
  return result.rows[0] || null;
};

// Delete company
export const deleteCompany = async (id: number): Promise<boolean> => {
  const result = await pool.query("DELETE FROM company WHERE company_id = $1", [id]);
  return result.rowCount > 0;
};

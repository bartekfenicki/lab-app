import type { Request, Response } from "express";
import * as CompanyModel from "../models/companyModel.js";

export const getCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await CompanyModel.getAllCompanies();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch companies" });
  }
};

export const getCompany = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const company = await CompanyModel.getCompanyById(id);
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch company" });
  }
};

export const createCompany = async (req: Request, res: Response) => {
  try {
    const newCompany = await CompanyModel.createCompany(req.body);
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(500).json({ error: "Failed to create company" });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const updated = await CompanyModel.updateCompany(id, req.body);
    if (!updated) return res.status(404).json({ error: "Company not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update company" });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const success = await CompanyModel.deleteCompany(id);
    if (!success) return res.status(404).json({ error: "Company not found" });
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete company" });
  }
};

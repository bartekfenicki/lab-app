import { Router } from "express";
import {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";

const router = Router();

router.get("/", getCompanies);      
router.get("/:id", getCompany);      
router.post("/", createCompany);    
router.put("/:id", updateCompany);  
router.delete("/:id", deleteCompany);

export default router;

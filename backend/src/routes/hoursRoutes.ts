import { Router } from "express";
import { getMonthlyHours } from "../controllers/hoursController.js";

const router = Router();

/**
 * @swagger
 * /api/hours/{user_id}/{month}:
 *   get:
 *     summary: Get monthly hours for a user
 *     tags: [Hours]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: "2025-09"
 *     responses:
 *       200:
 *         description: Monthly hours summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                 month:
 *                   type: string
 *                 total_hours:
 *                   type: number
 *                 approved_hours:
 *                   type: number
 */
router.get("/:user_id/:month", getMonthlyHours);

export default router;

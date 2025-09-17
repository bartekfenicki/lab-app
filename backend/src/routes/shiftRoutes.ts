import { Router } from "express";
import {
  createShift,
  getShifts,
  getShiftById,
  updateShift,
  deleteShift,
  startShift,
  endShift
} from "../controllers/shiftController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Shifts
 *   description: Shift management
 */

/**
 * @swagger
 * /api/shifts:
 *   post:
 *     summary: Create a new shift
 *     tags: [Shifts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shift'
 *     responses:
 *       201:
 *         description: Shift created successfully
 *       500:
 *         description: Failed to create shift
 */
router.post("/", createShift);

/**
 * @swagger
 * /api/shifts:
 *   get:
 *     summary: Get all shifts
 *     tags: [Shifts]
 *     responses:
 *       200:
 *         description: List of shifts
 *       500:
 *         description: Failed to fetch shifts
 */
router.get("/", getShifts);

/**
 * @swagger
 * /api/shifts/{id}:
 *   get:
 *     summary: Get a shift by ID
 *     tags: [Shifts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Shift ID
 *     responses:
 *       200:
 *         description: Shift found
 *       404:
 *         description: Shift not found
 */
router.get("/:id", getShiftById);

/**
 * @swagger
 * /api/shifts/{id}:
 *   put:
 *     summary: Update a shift
 *     tags: [Shifts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Shift ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shift'
 *     responses:
 *       200:
 *         description: Shift updated
 *       404:
 *         description: Shift not found
 */
router.put("/:id", updateShift);

/**
 * @swagger
 * /api/shifts/{id}/start:
 *   patch:
 *     summary: Start a shift (sets start_time and status)
 *     tags: [Shifts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Shift ID
 *     responses:
 *       200:
 *         description: Shift started
 *       400:
 *         description: Shift cannot be started
 */
router.patch("/:id/start", startShift);

/**
 * @swagger
 * /api/shifts/{id}/end:
 *   patch:
 *     summary: End a shift (sets end_time and status)
 *     tags: [Shifts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Shift ID
 *     responses:
 *       200:
 *         description: Shift ended
 *       400:
 *         description: Shift cannot be ended
 */
router.patch("/:id/end", endShift);


/**
 * @swagger
 * /api/shifts/{id}:
 *   delete:
 *     summary: Delete a shift
 *     tags: [Shifts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Shift ID
 *     responses:
 *       200:
 *         description: Shift deleted
 *       404:
 *         description: Shift not found
 */
router.delete("/:id", deleteShift);

export default router;

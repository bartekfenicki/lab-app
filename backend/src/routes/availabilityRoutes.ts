import { Router } from "express";
import {
  createAvailability,
  getAvailabilityByUser,
  getAvailabilityById,
  updateAvailability,
  deleteAvailability,
  upsertAvailability,
} from "../controllers/availabilityController.js";

const router = Router();

/**
 * @swagger
 * /api/availability:
 *   post:
 *     summary: Create new availability
 *     tags: [Availability]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Availability'
 *     responses:
 *       201:
 *         description: Availability created
 */
router.post("/", createAvailability);

/**
 * @swagger
 * /api/availability/user/{user_id}:
 *   get:
 *     summary: Get all availability for a user
 *     tags: [Availability]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of availability
 */
router.get("/user/:id", getAvailabilityByUser);

/**
 * @swagger
 * /api/availability/{id}:
 *   get:
 *     summary: Get single availability by ID
 *     tags: [Availability]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Availability object
 */
router.get("/:id", getAvailabilityById);

/**
 * @swagger
 * /api/availability/{id}:
 *   put:
 *     summary: Update availability by ID
 *     tags: [Availability]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Availability'
 *     responses:
 *       200:
 *         description: Updated availability
 */
router.put("/:id", updateAvailability);

/**
 * @swagger
 * /api/availability/{id}:
 *   delete:
 *     summary: Delete availability by ID
 *     tags: [Availability]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.delete("/:id", deleteAvailability);

router.post("/upsert", upsertAvailability);

export default router;

import { Router } from "express";
import {
  createNewsPost,
  getNewsPosts,
  getNewsPostById,
  updateNewsPost,
  deleteNewsPost,
  getPostsByCompany,
} from "../controllers/newsPostController.js";
import { upload } from "../middlewares/upload.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: NewsPosts
 *   description: CRUD operations for news posts
 */

/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: Create a news post
 *     tags: [NewsPosts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - created_by
 *               - title
 *               - description
 *               - image
 *             properties:
 *               created_by:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: News post created successfully
 */
router.post("/", authMiddleware, upload.single("image"), createNewsPost);

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Get all news posts
 *     tags: [NewsPosts]
 *     responses:
 *       200:
 *         description: List of news posts
 */
router.get("/", getNewsPosts);

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Get a news post by ID
 *     tags: [NewsPosts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: News post details
 *       404:
 *         description: News post not found
 */
router.get("/:id", getNewsPostById);


/**
 * @swagger
 * /api/news/company/{companyId}:
 *   get:
 *     summary: Get all news posts for a company
 *     tags: [NewsPosts]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the company
 *     responses:
 *       200:
 *         description: List of news posts for the company
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NewsPost'
 *       400:
 *         description: Invalid companyId
 *       404:
 *         description: No posts found for the given company
 *       500:
 *         description: Server error
 */
router.get("/company/:companyId", getPostsByCompany); 


/**
 * @swagger
 * /api/news/{id}:
 *   put:
 *     summary: Update a news post
 *     tags: [NewsPosts]
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
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: News post updated successfully
 *       404:
 *         description: News post not found
 */
router.put("/:id", updateNewsPost);

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: Delete a news post
 *     tags: [NewsPosts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: News post deleted successfully
 *       404:
 *         description: News post not found
 */
router.delete("/:id", deleteNewsPost);

export default router;

import { Router } from "express";
import { likePost, unlikePost, getLikesForPost } from "../controllers/newsReactionController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: NewsReactions
 *   description: Like/unlike functionality for news posts
 */

// Like a post
router.post("/", likePost);

// Unlike a post
router.delete("/:news_id/:user_id", unlikePost);

// Get all likes for a post
router.get("/:news_id", getLikesForPost);

export default router;

import { Request, Response } from "express";
import * as reactionModel from "../models/newsReactionModel.js";

// Like a post
export const likePost = async (req: Request, res: Response) => {
  try {
    const reaction = await reactionModel.createReaction({
      news_id: Number(req.body.news_id),
      user_id: Number(req.body.user_id),
    });
    res.status(201).json(reaction);
  } catch (err) {
    console.error("❌ Error liking post:", err);
    res.status(500).json({ error: "Failed to like post" });
  }
};

// Unlike a post
export const unlikePost = async (req: Request, res: Response) => {
  try {
    const success = await reactionModel.deleteReaction(
      Number(req.params.news_id),
      Number(req.params.user_id)
    );
    if (!success) return res.status(404).json({ error: "Reaction not found" });
    res.json({ message: "Reaction removed successfully" });
  } catch (err) {
    console.error("❌ Error unliking post:", err);
    res.status(500).json({ error: "Failed to unlike post" });
  }
};

// Get likes for a post
export const getLikesForPost = async (req: Request, res: Response) => {
  try {
    const reactions = await reactionModel.getReactionsForPost(Number(req.params.news_id));
    res.json(reactions);
  } catch (err) {
    console.error("❌ Error fetching reactions:", err);
    res.status(500).json({ error: "Failed to fetch reactions" });
  }
};

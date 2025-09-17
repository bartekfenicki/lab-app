import { Request, Response } from "express";
import * as newsPostModel from "../models/newsPostModel.js";

// ✅ Create a news post
export const createNewsPost = async (req: Request, res: Response) => {
  try {
    const newsPost = await newsPostModel.createNewsPost(req.body);
    res.status(201).json(newsPost);
  } catch (err) {
    console.error("❌ Error creating news post:", err);
    res.status(500).json({ error: "Failed to create news post" });
  }
};

// ✅ Get all news posts
export const getNewsPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await newsPostModel.getAllNewsPosts();
    res.json(posts);
  } catch (err) {
    console.error("❌ Error fetching news posts:", err);
    res.status(500).json({ error: "Failed to fetch news posts" });
  }
};

// ✅ Get single news post by ID
export const getNewsPostById = async (req: Request, res: Response) => {
  try {
    const post = await newsPostModel.getNewsPostById(Number(req.params.id));
    if (!post) return res.status(404).json({ error: "News post not found" });
    res.json(post);
  } catch (err) {
    console.error("❌ Error fetching news post:", err);
    res.status(500).json({ error: "Failed to fetch news post" });
  }
};

// ✅ Update news post
export const updateNewsPost = async (req: Request, res: Response) => {
  try {
    const updatedPost = await newsPostModel.updateNewsPost(Number(req.params.id), req.body);
    if (!updatedPost) return res.status(404).json({ error: "News post not found" });
    res.json(updatedPost);
  } catch (err) {
    console.error("❌ Error updating news post:", err);
    res.status(500).json({ error: "Failed to update news post" });
  }
};

// ✅ Delete news post
export const deleteNewsPost = async (req: Request, res: Response) => {
  try {
    const success = await newsPostModel.deleteNewsPost(Number(req.params.id));
    if (!success) return res.status(404).json({ error: "News post not found" });
    res.json({ message: "News post deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting news post:", err);
    res.status(500).json({ error: "Failed to delete news post" });
  }
};

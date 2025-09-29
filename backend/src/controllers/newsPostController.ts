import { Request, Response } from "express";
import * as newsPostModel from "../models/newsPostModel.js";
import cloudinary from "../config/cloudinary.js";

export interface AuthRequest extends Request {
  user?: {
    user_id: number;
    company_id: number;
    role_id: number;
  };
}

// ✅ Create a news post
export const createNewsPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    let imageUrl = "";

    // If file is uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url; // This is the URL to store in DB
    }


    
    const user = req.user; 

    console.log("req.user in controller:", req.user);

    if (!user) return res.status(401).json({ error: "Unauthorized" });
    
    const post = await newsPostModel.createNewsPost({
      title,
      description,
      created_by: user.user_id,
       company_id: user.company_id,
      image: imageUrl,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Get posts by company
export const getPostsByCompany = async (req: Request, res: Response) => {
  try {
    const companyId = parseInt(req.params.companyId);
    const news = await newsPostModel.getNewsPostsByCompany(companyId);
    res.json(news);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch company posts" });
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

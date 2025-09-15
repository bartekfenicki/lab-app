import type { Request, Response } from "express";
import * as UserModel from "../models/usersModel";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
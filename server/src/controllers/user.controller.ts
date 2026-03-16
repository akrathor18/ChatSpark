import type { Request, Response } from "express";
import * as userService from "../services/user.service.js";

export const searchUsers = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;

        const users = await userService.searchUsers(query);

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Search failed" });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    try {
        const user = await userService.getUserProfile(userId);
        res.status(200).json(user);
    }
    catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
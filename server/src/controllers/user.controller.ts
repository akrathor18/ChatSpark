import type { Request, Response } from "express";
import * as userService from "../services/user.service.js";

export const searchUsers = async (req: Request, res: Response) => {
    try {
        const currentUserId = (req as any).user.id;
        const query = req.query.q as string;

        const users = await userService.searchUsers(query, currentUserId);

        res.json(users);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Search failed", error: error });
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

export const checkUsername = async (req: Request, res: Response) => {
    try {
        const { username } = req.query;

        if (!username || typeof username !== "string") {
            return res.status(400).json({ message: "Username required" });
        }

        const result = await userService.checkUsernameAvailabilityService(username);

        res.json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateUsername = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: "Username required" });
        }

        const user = await userService.updateUsernameService(userId, username);

        res.json({
            message: "Username updated",
            user,
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
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
        res.status(500).json({ message: "Search failed", error: error instanceof Error ? error.message : "Unknown error" });
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

export const uploadProfilePicController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = (req as any).user?.id;
        const file = req.file;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "File not received",
            });
        }

        const result = await userService.uploadProfilePic({ userId, file });

        if (result?.notFound) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (result?.error) {
            return res.status(400).json({
                success: false,
                message: result.error,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            data: result,
        });
    } catch (error: any) {
        console.error("Upload Profile Error:", error.message);
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};

export const removeProfilePicController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const result = await userService.removeProfilePic(userId);

        if (result?.notFound) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile picture removed successfully",
        });
    } catch (error: any) {
        console.error("Remove Profile Pic Error:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
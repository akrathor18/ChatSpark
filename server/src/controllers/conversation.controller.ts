import { createConversationService, getUserConversationsService } from "../services/conversation.service.js";
import type { Request, Response } from "express";
export const createConversationController = async (req: Request, res: Response) => {
    try {
        const currentUserId = req.user.id;
        const { userId } = req.body;

        const conversation = await createConversationService(
            currentUserId,
            userId
        );

        res.status(201).json({
            success: true,
            data: conversation
        });

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getUserConversationsController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const conversations = await getUserConversationsService(userId);

        res.status(200).json({
            success: true,
            data: conversations
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
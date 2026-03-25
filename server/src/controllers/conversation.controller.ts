import { createConversationService, getUserConversationsService, markAsReadService } from "../services/conversation.service.js";
import type { Request, Response } from "express";

export const createConversationController = async (req: Request, res: Response) => {
    try {
        const currentUserId = (req as any).user.id;
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
        console.log(error)
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getUserConversationsController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const conversations = await getUserConversationsService(userId, page, limit);

        res.status(200).json({
            success: true,
            data: conversations,
            pagination: { page, limit }
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const markAsReadController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { id: conversationId } = req.params;

        await markAsReadService(conversationId, userId);

        res.status(200).json({
            success: true,
            message: "Conversation marked as read"
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
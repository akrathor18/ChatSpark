import type { Request, Response } from "express";
import * as messageService from "../services/message.service.js";
import { log } from "console";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { conversationId, content } = req.body;

    const message = await messageService.createMessage({
      conversationId,
      senderId: userId,
      content,
    });

    res.status(201).json(message);

  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {

    const { conversationId } = req.params;
    const userId = (req as any).user.id;
    const { limit, before } = req.query;

    const messages = await messageService.getConversationMessages(
      conversationId,
      userId,
      limit ? parseInt(limit as string) : 20,
      before as string
    );

    res.json(messages);

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
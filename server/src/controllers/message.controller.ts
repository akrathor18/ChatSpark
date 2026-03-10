import type { Request, Response } from "express";
import * as messageService from "../services/message.service.js";

export const sendMessage = async (req: Request, res: Response) => {
  try {

    const userId = req.user.id; // from auth middleware
    const { conversationId, content } = req.body;

    const message = await messageService.createMessage(
      conversationId,
      userId,
      content
    );

    res.status(201).json(message);

  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {

    const { conversationId } = req.params;

    const messages = await messageService.getConversationMessages(conversationId);

    res.json(messages);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
import type { Request, Response } from "express";
import * as messageService from "../services/message.service.js";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { conversationId, content, replyTo } = req.body;

    const message = await messageService.createMessage({
      conversationId,
      senderId: userId,
      content,
      replyTo,
    });

    res.status(201).json(message);

  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {

    const conversationId = req.params.conversationId as string;
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

export const unsendMessage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const messageId = req.params.messageId as string;

    const message = await messageService.unsendMessage(messageId, userId);

    res.json({ success: true, message });
  } catch (error: any) {
    const status = error.message === "Message not found" ? 404
      : error.message === "You can only unsend your own messages" ? 403
      : 400;
    res.status(status).json({ message: error.message });
  }
};

export const deleteMessageForMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const messageId = req.params.messageId as string;

    await messageService.deleteMessageForUser(messageId, userId);

    res.json({ success: true });
  } catch (error: any) {
    const status = error.message === "Message not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const getMessageInfo = async (req: Request, res: Response) => {
  try {
    const messageId = req.params.messageId as string;

    const message = await messageService.getMessageInfo(messageId);

    res.json(message);
  } catch (error: any) {
    const status = error.message === "Message not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};
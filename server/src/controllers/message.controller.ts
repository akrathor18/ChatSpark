import type { Request, Response } from "express";
import { Types } from "mongoose";
import * as messageService from "../services/message.service.js";
import { io } from "../index.js";

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

export const editMessage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const messageId = req.params.messageId as string;
    const { content } = req.body;

    // Validate messageId
    if (!Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    // Validate content — backend must reject empty / whitespace-only
    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ message: "Message content cannot be empty" });
    }

    const updatedMessage = await messageService.editMessage(
      messageId,
      userId,
      content.trim()
    );

    // Broadcast to all participants in the conversation so every client
    // replaces the message in place (not appends it).
    io.to(updatedMessage.conversationId.toString()).emit("message_edited", {
      message: updatedMessage,
    });

    return res.json({ success: true, message: updatedMessage });
  } catch (error: any) {
    const status =
      error.message === "Message not found" ? 404
      : error.message === "You can only edit your own messages" ? 403
      : error.message === "Messages can only be edited within 15 minutes of sending" ? 409
      : error.message === "Cannot edit an unsent message" ? 400
      : 500;
    return res.status(status).json({ message: error.message });
  }
};
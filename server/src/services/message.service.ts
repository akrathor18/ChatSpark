import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversations.model.js";
import { restoreChatForUsersService } from "./conversation.service.js";

export const createMessage = async ({
  conversationId,
  senderId,
  content,
  replyTo,
}: {
  conversationId: string;
  senderId: string;
  content: string;
  replyTo?: string;
}) => {
  const message = await Message.create({
    conversationId,
    senderId,
    content,
    ...(replyTo ? { replyTo } : {}),
  });

  // Update last message + restore chat for anyone who soft-deleted it
  const conversation = await Conversation.findById(conversationId);
  const hadDeletedUsers = conversation?.deletedFor && conversation.deletedFor.length > 0;

  await Conversation.findByIdAndUpdate(conversationId, {
    $set: {
      lastMessageId: message._id,
      lastMessage: content,
      lastMessageAt: new Date(),
      deletedFor: [],
    },
  });

  return { message, restoredChat: hadDeletedUsers };
};

export const getConversationMessages = async (
  conversationId: string,
  userId: string,
  limit: number = 20,
  before?: string
) => {

  const query: any = {
    conversationId,
    deletedFor: { $nin: [userId] },
  };

  if (before) {
    query.createdAt = { $lt: new Date(before) };
  }

  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate({
      path: "replyTo",
      select: "content senderId isUnsent",
      populate: {
        path: "senderId",
        select: "name",
      },
    });

  return messages.reverse();
};

export const unsendMessage = async (messageId: string, userId: string) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error("Message not found");
  }

  if (message.senderId.toString() !== userId) {
    throw new Error("You can only unsend your own messages");
  }

  if (message.isUnsent) {
    throw new Error("Message already unsent");
  }

  message.isUnsent = true;
  message.content = "";
  await message.save();

  return message;
};

export const deleteMessageForUser = async (messageId: string, userId: string) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error("Message not found");
  }

  // Add userId to deletedFor if not already there
  if (!message.deletedFor.some((id) => id.toString() === userId)) {
    message.deletedFor.push(userId as any);
    await message.save();
  }

  return message;
};

export const getMessageInfo = async (messageId: string) => {
  const message = await Message.findById(messageId)
    .populate("senderId", "name avatar email")
    .populate({
      path: "replyTo",
      select: "content senderId",
      populate: {
        path: "senderId",
        select: "name",
      },
    });

  if (!message) {
    throw new Error("Message not found");
  }

  return message;
};
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversations.model.js";
import { restoreChatForUsersService } from "./conversation.service.js";

export const createMessage = async ({
  conversationId,
  senderId,
  content,
}: {
  conversationId: string;
  senderId: string;
  content: string;
}) => {
  const message = await Message.create({
    conversationId,
    senderId,
    content,
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

  const query: any = { conversationId };

  if (before) {
    query.createdAt = { $lt: new Date(before) };
  }

  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(limit);

  return messages.reverse();
};
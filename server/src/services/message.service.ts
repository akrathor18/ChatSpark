import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversations.model.js";

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

  await Conversation.findByIdAndUpdate(conversationId, {
    $set: {
      lastMessageId: message._id,
      lastMessage: content,
      lastMessageAt: new Date(),
    },
  });

  return message;
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
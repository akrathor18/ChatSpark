import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversations.model.js";

export const createMessage = async (
  conversationId: string,
  senderId: string,
  content: string
) => {

  const message = await Message.create({
    conversationId,
    senderId,
    content
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessageId: message._id,
    lastMessage: content,
    lastMessageAt: new Date()
  });

  return message;
};

export const getConversationMessages = async (
  conversationId: string,
  userId: string
) => {

  const conversation = await Conversation.findOne({
    _id: conversationId,
    members: userId
  });

  if (!conversation) {
    throw new Error("Unauthorized access");
  }

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 });

  return messages;
};
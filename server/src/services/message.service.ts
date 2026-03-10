import {Message} from "../models/message.model.js";

export const createMessage = async (
  conversationId: string,
  senderId: string,
  content: string
) => {

  const message = await Message.create({
    conversationId,
    senderId: senderId,
    content
  });

  return message;
};

export const getConversationMessages = async (conversationId: string) => {

  const messages = await Message.find({
    conversationId
  })
  .sort({ createdAt: 1 });

  return messages;
};
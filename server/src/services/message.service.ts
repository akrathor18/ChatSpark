import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversations.model.js";
import { restoreChatForUsersService } from "./conversation.service.js";
import {
  encrypt,
  decrypt,
  encryptToJson,
} from "../utils/encryption.js";

// ─── Shared helper ─────────────────────────────────────────────────────────

/**
 * Decrypts a message's content field in place, returning a plain object
 * where `content` is a string.  Unsent messages are returned unchanged
 * (their content is already an empty sentinel).
 */
function decryptMessageContent(msg: any): any {
  if (msg.isUnsent) {
    return { ...msg, content: "" };
  }

  try {
    const { cipherText, iv, authTag } = msg.content ?? {};

    // Handle optimistic / in-transit messages that already carry a string
    if (typeof msg.content === "string") return msg;

    // Empty sentinel (should not normally reach the client, but guard anyway)
    if (!cipherText || !iv || !authTag) return { ...msg, content: "" };

    return { ...msg, content: decrypt(cipherText, iv, authTag) };
  } catch {
    return { ...msg, content: "[Decryption error]" };
  }
}

// ─── Service functions ──────────────────────────────────────────────────────

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
  // Encrypt the message body before persisting
  const encryptedContent = encrypt(content);

  const message = await Message.create({
    conversationId,
    senderId,
    content: encryptedContent,
    ...(replyTo ? { replyTo } : {}),
  });

  // Update lastMessage + restore chat for anyone who soft-deleted it
  const conversation = await Conversation.findById(conversationId);
  const hadDeletedUsers =
    conversation?.deletedFor && conversation.deletedFor.length > 0;

  // Encrypt the lastMessage preview stored on the conversation document
  const encryptedLastMessage = encryptToJson(content);

  await Conversation.findByIdAndUpdate(conversationId, {
    $set: {
      lastMessageId: message._id,
      lastMessage: encryptedLastMessage,
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

  // Decrypt and serialize for the client
  return messages.reverse().map((msg) => {
    const plain = msg.toObject();
    const decrypted = decryptMessageContent(plain);

    // Decrypt the nested replyTo.content if present
    if (decrypted.replyTo && !decrypted.replyTo.isUnsent) {
      try {
        const rt = decrypted.replyTo;
        if (rt.content && typeof rt.content === "object") {
          const { cipherText, iv, authTag } = rt.content;
          decrypted.replyTo = {
            ...rt,
            content: decrypt(cipherText, iv, authTag),
          };
        }
      } catch {
        decrypted.replyTo = { ...decrypted.replyTo, content: "[Decryption error]" };
      }
    }

    return decrypted;
  });
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
  // Clear content using the empty-sentinel (valid IEncryptedContent shape)
  message.content = { cipherText: "", iv: "", authTag: "" } as any;
  await message.save();

  return message;
};

export const deleteMessageForUser = async (
  messageId: string,
  userId: string
) => {
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

  const plain = message.toObject();
  return decryptMessageContent(plain);
};
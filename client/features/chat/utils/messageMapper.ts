import { formatMessageTime } from "./formatMessageTime";

export const mapMessages = (messages: any, conversationId: any, currentUserId: string) => {
  const idStr = conversationId?.toString();
  if (!idStr || !messages) {
    console.warn("mapMessages: missing idStr or messages record", { idStr, messagesExist: !!messages });
    return [];
  }

  // Robust lookup: conversationId in the messages record
  const rawData = messages[idStr];
  
  if (!rawData) {
    console.warn(`mapMessages: No messages found in record for key: "${idStr}". Available keys:`, Object.keys(messages));
    return [];
  }
  // 🔥 Robustly extract the array from the rawData (could be raw array or envelope)
  const raw = Array.isArray(rawData) ? rawData : (Array.isArray(rawData?.data) ? rawData.data : []);

  if (raw.length === 0) return [];

  return raw.map((msg: any) => {
    // senderId can be a populated object { _id, ... } or just a string ID
    const senderRaw = msg.senderId?._id || msg.senderId;
    const senderId = senderRaw?.toString();
    const currentId = currentUserId?.toString();
    const createdAt = msg.createdAt || new Date().toISOString();

    return {
      id: msg._id?.toString() || msg.id?.toString() || msg.tempId,
      content: msg.content || "",
      timestamp: formatMessageTime(createdAt),
      createdAt,
      isSent: senderId === currentId,
      status: msg.status ?? "sent",
    };
  });
};
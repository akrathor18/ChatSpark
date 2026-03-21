export const mapMessages = (messages: any, conversationId: string | null, currentUserId: string) => {
  if (!conversationId || !messages) return [];

  const raw = Array.isArray(messages)
    ? messages
    : messages[conversationId] ?? [];

  return raw.map((msg: any) => ({
    id: msg._id,
    content: msg.content,
    timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isSent: msg.senderId === currentUserId,
    status: msg.status ?? "sent",
  }));
};
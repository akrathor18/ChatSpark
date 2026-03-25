import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useMessageStore } from "@/features/chat/store/useMessageStore";
import { useConversationStore } from "@/features/chat/store/useConversationStore";

export const useChatSocket = (conversationId: string | null, userId?: string) => {
  const socket = getSocket();

  useEffect(() => {
    // 🔹 Identify user on connect
    const onConnect = () => {
      console.log("Socket Connected:", socket.id);
      if (userId) {
        socket.emit("register_user", userId);
      }
    };

    // 🔹 Listen for realtime messages
    const onReceiveMessage = (message: any) => {
      console.log("Realtime message received:", message);
      
      // 1. Update message store (handles optimistic replacement and confirmed storage)
      useMessageStore.getState().addMessage(message);

      // 2. Update conversation list store
      useConversationStore.getState().updateConversationFromMessage(message);

      // 3. If it's the current chat and we are NOT the sender, mark it as read immediately
      if (conversationId === message.conversationId && userId !== message.senderId) {
          socket.emit("mark_read", { conversationId, userId });
      }
    };

    // 🔹 Listen for "messages read" status updates
    const onMessagesRead = (data: any) => {
        const { conversationId: convId, messageIds } = data;
        messageIds.forEach((id: string) => {
            useMessageStore.getState().updateMessage(convId, id, { status: "read" });
        });
    };

    // 🔹 Listen for message failures
    const onMessageFailed = (data: any) => {
        const { tempId, error } = data;
        if (conversationId) {
            useMessageStore.getState().updateMessage(conversationId, tempId, { status: "failed", error });
        }
    };

    socket.on("connect", onConnect);
    socket.on("receive_message", onReceiveMessage);
    socket.on("messages_read", onMessagesRead);
    socket.on("message_failed", onMessageFailed);

    // If already connected, call onConnect manually
    if (socket.connected) {
      onConnect();
    }

    // Special trigger: When the conversation changes, notify the server we've read it
    if (conversationId && userId) {
        socket.emit("mark_read", { conversationId, userId });
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("receive_message", onReceiveMessage);
      socket.off("messages_read", onMessagesRead);
      socket.off("message_failed", onMessageFailed);
    };
  }, [conversationId, userId]); // Re-bind if conversation or user changes

  // 🔹 Join specific conversation rooms when the active chat changes
  useEffect(() => {
    if (conversationId) {
      socket.emit("join_conversation", conversationId);
      console.log("Joining conversation room:", conversationId);
    }
  }, [conversationId]);

  const sendMessage = (content: string) => {
    if (!conversationId || !userId) return;

    const tempId = `optimistic_${Date.now()}`;
    const optimisticMessage = {
        tempId,
        conversationId,
        senderId: userId,
        content,
        status: "sending",
        createdAt: new Date().toISOString()
    };

    // 1. Add to message store immediately
    useMessageStore.getState().addMessage(optimisticMessage);

    // 2. Update conversation list snippet immediately
    useConversationStore.getState().updateConversationFromMessage(optimisticMessage);

    // 3. Emit via socket
    socket.emit("send_message", {
      conversationId,
      senderId: userId,
      content,
      tempId
    });
  };

  return { sendMessage };
};
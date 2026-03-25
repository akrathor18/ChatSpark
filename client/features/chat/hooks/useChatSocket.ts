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
      
      // 1. Update message store (this handles global state, deduplication inside)
      useMessageStore.getState().addMessage(message);

      // 2. Update conversation list store
      useConversationStore.getState().updateConversationFromMessage(message);
    };

    socket.on("connect", onConnect);
    socket.on("receive_message", onReceiveMessage);

    // If already connected, call onConnect manually
    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("receive_message", onReceiveMessage);
    };
  }, [userId]); // Re-register if userId changes

  // 🔹 Join specific conversation rooms when the active chat changes
  useEffect(() => {
    if (conversationId) {
      socket.emit("join_conversation", conversationId);
      console.log("Joining conversation room:", conversationId);
    }
  }, [conversationId]);

  const sendMessage = (content: string) => {
    if (!conversationId || !userId) return;

    socket.emit("send_message", {
      conversationId,
      senderId: userId,
      content,
    });
  };

  return { sendMessage };
};
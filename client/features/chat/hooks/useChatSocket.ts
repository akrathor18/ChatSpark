import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useMessageStore } from "@/features/chat/store/useMessageStore";

export const useChatSocket = (conversationId: string | null, userId?: string) => {
  const socket = getSocket();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("receive_message", (message) => {
      console.log("Realtime message:", message);
      useMessageStore.getState().addMessage(message);
    });

    return () => {
      socket.off("connect");
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    if (conversationId) {
      socket.emit("join_conversation", conversationId);
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
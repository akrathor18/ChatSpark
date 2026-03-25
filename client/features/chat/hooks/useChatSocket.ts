import { useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";
import { useMessageStore } from "@/features/chat/store/useMessageStore";
import { useConversationStore } from "@/features/chat/store/useConversationStore";

export const useChatSocket = (conversationId: string | null, userId?: string) => {
  const socket = getSocket();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onConnect = () => {
      console.log("Socket Connected:", socket.id);

      if (userId) {
        socket.emit("register_user", userId);
      }

      socket.emit("get_online_users");
    };

    const onReceiveMessage = (message: any) => {
      useMessageStore.getState().addMessage(message);
      useConversationStore.getState().updateConversationFromMessage(message);

      if (conversationId === message.conversationId && userId !== message.senderId) {
        socket.emit("mark_read", { conversationId, userId });
      }
    };

    const onMessagesRead = (data: any) => {
      const { conversationId: convId, messageIds } = data;
      messageIds.forEach((id: string) => {
        useMessageStore.getState().updateMessage(convId, id, { status: "read" });
      });
    };

    const onMessageFailed = (data: any) => {
      const { tempId, error } = data;
      if (conversationId) {
        useMessageStore.getState().updateMessage(conversationId, tempId, {
          status: "failed",
          error,
        });
      }
    };

    const onUserOnline = ({ userId }: any) => {
      useConversationStore.getState().setUserOnline(userId, true);
    };

    const onUserOffline = ({ userId, lastSeen }: any) => {
      useConversationStore.getState().setUserOnline(userId, false, lastSeen);
    };

    const onOnlineUsers = (users: string[]) => {
      users.forEach((id) => {
        useConversationStore.getState().setUserOnline(id, true);
      });
    };

    const onDisconnect = () => {
      useConversationStore.getState().resetOnlineUsers();
    };

    const onTyping = ({ conversationId: convId, userId: uid }: any) => {
      useConversationStore.getState().setTyping(convId, uid, true);
    };

    const onStopTyping = ({ conversationId: convId, userId: uid }: any) => {
      useConversationStore.getState().setTyping(convId, uid, false);
    };

    // REGISTER EVENTS
    socket.on("connect", onConnect);
    socket.on("receive_message", onReceiveMessage);
    socket.on("messages_read", onMessagesRead);
    socket.on("message_failed", onMessageFailed);

    socket.on("user_online", onUserOnline);
    socket.on("user_offline", onUserOffline);
    socket.on("online_users", onOnlineUsers);
    socket.on("disconnect", onDisconnect);
    socket.on("typing", onTyping);
    socket.on("stop_typing", onStopTyping);

    if (socket.connected) {
      onConnect();
    }

    if (conversationId && userId) {
      socket.emit("mark_read", { conversationId, userId });
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("receive_message", onReceiveMessage);
      socket.off("messages_read", onMessagesRead);
      socket.off("message_failed", onMessageFailed);

      socket.off("user_online", onUserOnline);
      socket.off("user_offline", onUserOffline);
      socket.off("online_users", onOnlineUsers);
      socket.off("disconnect", onDisconnect);

      socket.off("typing", onTyping);
      socket.off("stop_typing", onStopTyping);
    };

  }, [conversationId, userId]);

  useEffect(() => {
    if (conversationId) {
      socket.emit("join_conversation", conversationId);
    }
  }, [conversationId]);

  const sendMessage = (content: string) => {
    if (!conversationId || !userId) return;

    // Stop typing immediately when sending
    stopTyping();

    const tempId = `optimistic_${Date.now()}`;

    const optimisticMessage = {
      tempId,
      conversationId,
      senderId: userId,
      content,
      status: "sending",
      createdAt: new Date().toISOString(),
    };

    useMessageStore.getState().addMessage(optimisticMessage);
    useConversationStore.getState().updateConversationFromMessage(optimisticMessage);

    socket.emit("send_message", {
      conversationId,
      senderId: userId,
      content,
      tempId,
    });
  };

  const startTyping = () => {
    if (!conversationId || !userId) return;

    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    } else {
        socket.emit("typing", { conversationId, userId });
    }

    typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
    }, 3000);
  };

  const stopTyping = () => {
    if (!conversationId || !userId) return;

    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
        socket.emit("stop_typing", { conversationId, userId });
    }
  };

  return { sendMessage, startTyping };
};
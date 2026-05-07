import { useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";
import { useMessageStore } from "@/features/chat/store/useMessageStore";
import { useConversationStore } from "@/features/chat/store/useConversationStore";

export const useChatSocket = (conversationId: string | null, userId?: string) => {
  const socket = getSocket();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onConnect = () => {

      if (userId) {
        socket.emit("register_user", userId);
      }

      socket.emit("get_online_users");
    };

    const onReceiveMessage = (message: any) => {
      const convId = message.conversationId?.toString();
      const sendId = message.senderId?.toString();
      const currentUserId = userId?.toString();

      // Ensure message IDs are clean strings before store update
      const cleanMessage = {
        ...message,
        conversationId: convId,
        senderId: sendId,
      };

      useMessageStore.getState().addMessage(cleanMessage);
      useConversationStore.getState().updateConversationFromMessage(cleanMessage);

      if (conversationId?.toString() === convId && currentUserId !== sendId) {
        socket.emit("mark_read", { conversationId: convId, userId: currentUserId });
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

    const onChatRestored = ({ conversationId: convId }: any) => {
      // Re-fetch conversations so the restored chat appears in sidebar
      useConversationStore.getState().fetchConversations();
    };

    const onUserBlocked = ({ blockerId, targetId }: any) => {
      const currentUserId = userId?.toString();
      if (blockerId === currentUserId) {
        // I blocked someone
        useConversationStore.getState().addBlockedByMe(targetId);
      } else if (targetId === currentUserId) {
        // Someone blocked me
        useConversationStore.getState().addBlockedMe(blockerId);
      }
    };

    const onUserUnblocked = ({ blockerId, targetId }: any) => {
      const currentUserId = userId?.toString();
      if (blockerId === currentUserId) {
        // I unblocked someone
        useConversationStore.getState().removeBlockedByMe(targetId);
      } else if (targetId === currentUserId) {
        // Someone unblocked me
        useConversationStore.getState().removeBlockedMe(blockerId);
      }
    };

    const onMessageBlocked = (data: any) => {
      const { conversationId: convId, tempId } = data;
      if (convId) {
        useMessageStore.getState().updateMessage(convId, tempId, {
          status: "failed",
          error: "Message blocked",
        });
      }
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
    socket.on("chatRestored", onChatRestored);
    socket.on("user_blocked", onUserBlocked);
    socket.on("user_unblocked", onUserUnblocked);
    socket.on("message_blocked", onMessageBlocked);

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
      socket.off("chatRestored", onChatRestored);
      socket.off("user_blocked", onUserBlocked);
      socket.off("user_unblocked", onUserUnblocked);
      socket.off("message_blocked", onMessageBlocked);
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
    const convId = conversationId.toString();
    const currentUserId = userId.toString();

    const optimisticMessage = {
      tempId,
      conversationId: convId,
      senderId: currentUserId,
      content,
      status: "sending",
      createdAt: new Date().toISOString(),
    };

    useMessageStore.getState().addMessage(optimisticMessage);
    useConversationStore.getState().updateConversationFromMessage(optimisticMessage);

    socket.emit("send_message", {
      conversationId: convId,
      senderId: currentUserId,
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
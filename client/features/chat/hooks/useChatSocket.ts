import { useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";
import { useMessageStore } from "@/features/chat/store/useMessageStore";
import { useConversationStore } from "@/features/chat/store/useConversationStore";
import { useProfileStore } from "@/features/profile/store/useProfileStore";
import { showNotification } from "@/lib/notification";

export const useChatSocket = (
  conversationId: string | null,
  userId?: string,
  onNewMessage?: () => void,
) => {
  const socket = getSocket();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onConnect = () => {

      if (userId) {
        socket.emit("register_user");
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

      // Notify the container to scroll when a message arrives for the active chat
      const selectedId = useConversationStore.getState().selectedConversationId;
      if (selectedId === convId) {
        onNewMessage?.();
      }

      if (conversationId?.toString() === convId && currentUserId !== sendId) {
        socket.emit("mark_read", { conversationId: convId });
      }

      // ── Notification Logic ──
      if (currentUserId !== sendId) {
        // Tab is considered active if it is visible to the user
        const isTabVisible = typeof document !== "undefined" && document.visibilityState === "visible";
        
        // Show notification if the tab is hidden OR they are looking at a different chat
        if (!isTabVisible || selectedId !== convId) {
          const userProfile = useProfileStore.getState().user;
          // default to true if setting is not explicitly false
          const allowNotif = userProfile?.notificationSettings?.notifications !== false; 
          
          if (allowNotif) {
            // Find sender's name from conversations list
            const conv = useConversationStore.getState().conversations.find((c: any) => c.conversationId?.toString() === convId);
            const senderName = conv?.user?.name || "New Message";
            
            showNotification({
              title: senderName,
              body: cleanMessage.content || "Sent an attachment",
              onClick: () => {
                useConversationStore.getState().setSelectedConversationId(convId);
              }
            });
          }
        }
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

    const onMessageUnsent = (data: any) => {
      const { conversationId: convId, messageId } = data;
      if (convId && messageId) {
        useMessageStore.getState().markAsUnsent(convId, messageId);
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
    socket.on("message_unsent", onMessageUnsent);

    if (socket.connected) {
      onConnect();
    }

    if (conversationId && userId) {
      socket.emit("mark_read", { conversationId });
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
      socket.off("message_unsent", onMessageUnsent);
    };

  }, [conversationId, userId]);

  useEffect(() => {
    if (conversationId) {
      socket.emit("join_conversation", conversationId);
    }
  }, [conversationId]);

  const sendMessage = (content: string, replyToId?: string) => {
    if (!conversationId || !userId) return;

    // Stop typing immediately when sending
    stopTyping();

    const tempId = `optimistic_${Date.now()}`;
    const convId = conversationId.toString();
    const currentUserId = userId.toString();

    // Build a populated replyTo for immediate display (no page-refresh needed).
    // useConversationStore.getState() is an imperative Zustand call — safe outside render.
    const replyingTo = useConversationStore.getState().replyingTo;
    const optimisticReplyTo = replyToId
      ? replyingTo
        ? {
            id:         replyingTo.id ?? replyToId,
            content:    replyingTo.isUnsent ? "" : (replyingTo.content ?? ""),
            senderName: replyingTo.isSent ? "You" : undefined,
            isUnsent:   replyingTo.isUnsent ?? false,
          }
        : { id: replyToId, content: "", senderName: undefined, isUnsent: false }
      : undefined;

    const optimisticMessage = {
      tempId,
      conversationId: convId,
      senderId: currentUserId,
      content,
      status: "sending",
      createdAt: new Date().toISOString(),
      ...(optimisticReplyTo ? { replyTo: optimisticReplyTo } : {}),
    };

    useMessageStore.getState().addMessage(optimisticMessage);
    useConversationStore.getState().updateConversationFromMessage(optimisticMessage);

    socket.emit("send_message", {
      conversationId: convId,
      content,
      tempId,
      ...(replyToId ? { replyTo: replyToId } : {}),
    });
  };

  const startTyping = () => {
    if (!conversationId) return;

    // Emit "typing" only at the start of each debounce window.
    // If no timeout is pending, this is the first keystroke of a new burst.
    if (!typingTimeoutRef.current) {
      socket.emit("typing", { conversationId });
    } else {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const stopTyping = () => {
    if (!conversationId) return;

    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
        socket.emit("stop_typing", { conversationId });
    }
  };

  return { sendMessage, startTyping };
};
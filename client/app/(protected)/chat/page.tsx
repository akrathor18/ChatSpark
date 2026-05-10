"use client";

import { useEffect, useMemo, useCallback } from "react";
import { ConversationList } from "@/features/chat/components/conversation-list";
import { ChatContainer } from "@/features/chat/containers/ChatContainer";
import { NewChatModal } from "@/features/chat/components/new-chat-modal";
import { useConversationStore } from "@/features/chat/store/useConversationStore";
import { useMessageStore } from "@/features/chat/store/useMessageStore";
import { useProfile } from "@/features/profile/hooks/useProfile";
import ChatSkeleton from "@/features/chat/components/chat-skeleton";

import { useChatSocket } from "@/features/chat/hooks/useChatSocket";
import { mapMessages } from "@/features/chat/utils/messageMapper";

export default function ChatPage() {
  const { user, getProfile } = useProfile();
  const {
    conversations,
    isLoading,
    error,
    fetchConversations,
    selectedConversationId,
    setSelectedConversationId,
    selectedConversationUser,
    userStatus,
    deleteChatForUser,
    blockedByMe,
    blockedMe,
    blockUser,
    unblockUser,
    fetchBlockedUsers,
  } = useConversationStore();

  const { messages, fetchMessages } = useMessageStore();

  // 🔹 Fetch user
  useEffect(() => {
    if (!user) getProfile();
  }, []);

  // 🔹 Fetch conversations + blocked users
  useEffect(() => {
    if (user) {
      fetchConversations();
      fetchBlockedUsers();
    }
  }, [user]);

  const CURRENT_USER_ID = user?._id || "";

  // 🔹 Socket Hook
  const { sendMessage, startTyping } = useChatSocket(selectedConversationId, user?._id);

  // 🔹 Transform messages
  const currentMessages = useMemo(() => {
    return mapMessages(messages, selectedConversationId, CURRENT_USER_ID);
  }, [messages, selectedConversationId, CURRENT_USER_ID]);

  // 🔹 Handlers
  const handleSelectConversation = useCallback((id: string) => {
    setSelectedConversationId(id);
    fetchMessages(id);
  }, [setSelectedConversationId, fetchMessages]);

  const handleBack = useCallback(() => {
    setSelectedConversationId(null);
  }, [setSelectedConversationId]);

  const handleSendMessage = useCallback((content: string, replyToId?: string) => {
    sendMessage(content, replyToId);
  }, [sendMessage]);

  const handleTyping = useCallback(() => {
    startTyping();
  }, [startTyping]);

  const handleDeleteChat = useCallback((conversationId: string) => {
    deleteChatForUser(conversationId);
  }, [deleteChatForUser]);

  const handleDeleteCurrentChat = useCallback(() => {
    if (selectedConversationId) {
      deleteChatForUser(selectedConversationId);
    }
  }, [selectedConversationId, deleteChatForUser]);

  const handleNewChat = useCallback((user: any, conversationId: string) => {
    if (conversationId) {
      setSelectedConversationId(conversationId);
      fetchMessages(conversationId);
    }
  }, [setSelectedConversationId, fetchMessages]);

  // 🔹 Block handlers
  const selectedUserId = useMemo(() => {
    return selectedConversationUser?.user?.id?.toString() || "";
  }, [selectedConversationUser]);

  const isBlockedByMe = useMemo(() => {
    return selectedUserId ? blockedByMe.includes(selectedUserId) : false;
  }, [selectedUserId, blockedByMe]);

  const isBlockedMe = useMemo(() => {
    return selectedUserId ? blockedMe.includes(selectedUserId) : false;
  }, [selectedUserId, blockedMe]);

  const handleBlockUser = useCallback(() => {
    if (selectedUserId) {
      blockUser(selectedUserId);
    }
  }, [selectedUserId, blockUser]);

  const handleUnblockUser = useCallback(() => {
    if (selectedUserId) {
      unblockUser(selectedUserId);
    }
  }, [selectedUserId, unblockUser]);

  const existingConversationMap = useMemo(() => {
    return conversations.reduce((acc: any, c: any) => {
      if (c.user?._id) {
        acc[c.user._id.toString()] = c.conversationId;
      }
      return acc;
    }, {});
  }, [conversations]);

  // Merge reactive userStatus into conversations so online dots update in real-time
  const conversationsWithStatus = useMemo(() => {
    return conversations.map((c: any) => ({
      ...c,
      isOnline: c.user?._id ? (userStatus[c.user._id.toString()]?.online ?? false) : false,
      isBlocked: c.user?._id ? blockedByMe.includes(c.user._id.toString()) : false,
    }));
  }, [conversations, userStatus, blockedByMe]);

  // Reactive selected user with real-time online status
  const selectedUserWithStatus = useMemo(() => {
    if (!selectedConversationUser?.user) return null;
    const userId = selectedConversationUser.user.id.toString();
    const status = userStatus[userId];
    
    return {
      ...selectedConversationUser.user,
      isOnline: status?.online ?? false,
      lastSeen: status?.lastSeen,
    };
  }, [selectedConversationUser, userStatus]);

  // 🔹 Loading state
  if (isLoading || !user) {
    return <ChatSkeleton />;
  }

  // 🔹 Error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="relative flex h-[100dvh] w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={[
          "h-full flex-shrink-0",
          "max-md:absolute max-md:inset-0 max-md:z-20 max-md:w-full transition-transform duration-300",
          selectedConversationId ? "max-md:-translate-x-full" : "max-md:translate-x-0",
          "md:relative md:w-80 lg:w-96",
        ].join(" ")}
      >
        <ConversationList
          conversations={conversationsWithStatus}
          selectedId={selectedConversationId}
          onSelect={handleSelectConversation}
          onDelete={handleDeleteChat}
          user={user}
          newChatButton={
            <NewChatModal
              existingConversationMap={existingConversationMap}
              onSelectUser={handleNewChat}
            />
          }
        />
      </aside>

      {/* Chat Window */}
      <main
        className={[
          "flex flex-col flex-1 min-w-0 h-full",
          "max-md:absolute max-md:inset-0 max-md:z-20 transition-transform duration-300",
          selectedConversationId ? "max-md:translate-x-0" : "max-md:translate-x-full",
        ].join(" ")}
      >
        <ChatContainer
          user={selectedUserWithStatus}
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          onBack={handleBack}
          onDeleteChat={handleDeleteCurrentChat}
          isBlockedByMe={isBlockedByMe}
          isBlockedMe={isBlockedMe}
          onBlockUser={handleBlockUser}
          onUnblockUser={handleUnblockUser}
        />
      </main>
    </div>
  );
}
"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { ConversationList, type Conversation } from "@/components/chat/conversation-list"
import { ChatWindow, type Message, type ChatUser } from "@/components/chat/chat-window"
import { NewChatModal, type SearchableUser } from "@/components/chat/new-chat-modal"
import { useConversationStore } from "@/store/useConversationStore"
import { useMessageStore } from "@/store/useMessageStore"
import ChatSkeleton from "@/components/chat/chat-skeleton"
import { useUserStore } from "@/store/useUserStore"
import { getSocket } from "@/lib/socket";
// Define expected backend message shape
interface BackendMessage {
  _id: string
  content: string
  createdAt: string
  senderId: string
  status?: "sent" | "delivered" | "read"
}

export default function ChatPage() {
  const { user, getProfile } = useUserStore()

  const { conversations, isLoading, error, fetchConversations, selectedConversation, selectedConversationUser } = useConversationStore()
  const { messages, fetchMessages, sendMessage } = useMessageStore()

  useEffect(() => {
    if (!user) {
      getProfile()
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchConversations()
    }
  }, [user])
  //   if (!user) {
  //   return <div>Loading profile...</div>
  // }
  const socket = getSocket();

useEffect(() => {
  console.log("useeffect run")
  socket.on("connect", () => {
    console.log("Connected:", socket.id);
  });

  return () => {
    socket.off("connect");
  };
}, []);

  const CURRENT_USER_ID = user?._id || ""
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  // ── Transform backend messages → UI Message shape ──────────────────────────
  const currentMessages: Message[] = useMemo(() => {
    if (!selectedConversationId || !messages) return []

    const raw: BackendMessage[] = Array.isArray(messages)
      ? messages
      : ((messages as Record<string, BackendMessage[]>)[selectedConversationId] ?? [])

    return raw.map((msg) => ({
      id: msg._id,
      content: msg.content,
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isSent: msg.senderId === CURRENT_USER_ID,
      status: msg.status ?? "sent",
    }))
  }, [messages, selectedConversationId, CURRENT_USER_ID])
  // ──────────────────────────────────────────────────────────────────────────

  const handleSelectConversation = useCallback((id: string) => {
    setSelectedConversationId(id)
    selectedConversation(id)
    fetchMessages(id)
  }, [fetchMessages, selectedConversation])

  const handleBack = useCallback(() => {
    setSelectedConversationId(null)
  }, [])

  const handleSendMessage = useCallback(async (content: string) => {
    if (!selectedConversationId) return
    // Call your store's sendMessage (adjust params to match your store's API)
    await sendMessage(selectedConversationId, content)
    // Refresh messages and conversations after sending
    fetchMessages(selectedConversationId)
    fetchConversations()
  }, [selectedConversationId, sendMessage, fetchMessages, fetchConversations])

  const handleNewChat = useCallback((user: SearchableUser, conversationId: string) => {
    if (conversationId) {
      setSelectedConversationId(conversationId)
      fetchMessages(conversationId)
    }
  }, [fetchMessages])
  const existingConversationMap = conversations.reduce((acc: any, c: any) => {
    if (c.user && c.user._id) {
      acc[c.user._id.toString()] = c.conversationId;
    }
    return acc;
  }, {});
  
if (isLoading ||!user) {
  return <ChatSkeleton />
}
  error && <div>Error: {error}</div>

  return (
    <div className="relative flex h-[100dvh] w-screen overflow-hidden bg-background">
      <aside
        className={[
          "h-full flex-shrink-0",
          "max-md:absolute max-md:inset-0 max-md:z-20 max-md:w-full max-md:transition-transform max-md:duration-300 max-md:ease-in-out",
          selectedConversationId ? "max-md:-translate-x-full" : "max-md:translate-x-0",
          "md:relative md:w-80 lg:w-96",
        ].join(" ")}
      >
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversationId}
          onSelect={handleSelectConversation}
          user={user}
          newChatButton={
            <NewChatModal
              existingConversationMap={existingConversationMap}
              onSelectUser={handleNewChat}
            />
          }
        />
      </aside>

      <main
        className={[
          "flex flex-col flex-1 min-w-0 h-full",
          "max-md:absolute max-md:inset-0 max-md:z-20 max-md:transition-transform max-md:duration-300 max-md:ease-in-out",
          selectedConversationId ? "max-md:translate-x-0" : "max-md:translate-x-full",
        ].join(" ")}
      >
        <ChatWindow
          user={selectedConversationUser?.user}
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          onBack={handleBack}
        />
      </main>
    </div>
  )
}
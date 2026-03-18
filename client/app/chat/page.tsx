"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { ConversationList, type Conversation } from "@/components/chat/conversation-list"
import { ChatWindow, type Message, type ChatUser } from "@/components/chat/chat-window"
import { NewChatModal, type SearchableUser } from "@/components/chat/new-chat-modal"
import { useConversationStore } from "@/store/useConversationStore"
import { useMessageStore } from "@/store/useMessageStore"
import ChatSkeleton from "@/components/chat/chat-skeleton"
import { useUserStore } from "@/store/useUserStore"
// All searchable users (simulates a user directory)
const allSearchableUsers: SearchableUser[] = [
  { id: "1", name: "Sarah Chen", email: "sarah.chen@example.com", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", isOnline: true },
  { id: "2", name: "Alex Rivera", email: "alex.rivera@example.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", isOnline: true },
  { id: "3", name: "Jordan Taylor", email: "jordan.t@example.com", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop", isOnline: false },
  { id: "4", name: "Design Team", email: "design@company.com", avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop", isOnline: false },
  { id: "5", name: "Emma Watson", email: "emma.w@example.com", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", isOnline: false },
  { id: "6", name: "Marcus Johnson", email: "marcus.j@example.com", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", isOnline: true },
  { id: "7", name: "Engineering", email: "engineering@company.com", avatar: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=100&h=100&fit=crop", isOnline: false },
  { id: "8", name: "Olivia Martinez", email: "olivia.m@example.com", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", isOnline: true },
  { id: "9", name: "Liam Anderson", email: "liam.a@example.com", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", isOnline: false },
  { id: "10", name: "Sophia Kim", email: "sophia.kim@example.com", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop", isOnline: true },
]

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
              users={allSearchableUsers}
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
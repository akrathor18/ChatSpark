"use client"

import { useState, useCallback } from "react"
import { ConversationList, type Conversation } from "@/components/chat/conversation-list"
import { ChatWindow, type Message, type ChatUser } from "@/components/chat/chat-window"
import { NewChatModal, type SearchableUser } from "@/components/chat/new-chat-modal"

// Sample data
const sampleConversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    lastMessage: "That sounds great! Let me know when you're free",
    timestamp: "2:34 PM",
    unreadCount: 3,
    isOnline: true,
  },
  {
    id: "2",
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    lastMessage: "I'll send over the files tonight",
    timestamp: "1:15 PM",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "3",
    name: "Jordan Taylor",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
    lastMessage: "Meeting moved to 3pm tomorrow",
    timestamp: "11:42 AM",
    unreadCount: 1,
    isOnline: false,
  },
  {
    id: "4",
    name: "Design Team",
    avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop",
    lastMessage: "Mike: New mockups are ready for review",
    timestamp: "Yesterday",
    unreadCount: 12,
    isOnline: false,
  },
  {
    id: "5",
    name: "Emma Watson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    lastMessage: "Thanks for your help!",
    timestamp: "Yesterday",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "6",
    name: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    lastMessage: "Let's catch up this weekend",
    timestamp: "Monday",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "7",
    name: "Engineering",
    avatar: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=100&h=100&fit=crop",
    lastMessage: "David: Bug fix deployed to production",
    timestamp: "Monday",
    unreadCount: 0,
    isOnline: false,
  },
]

const sampleMessages: Record<string, Message[]> = {
  "1": [
    { id: "1", content: "Hey! How's the project going?", timestamp: "2:15 PM", isSent: false },
    { id: "2", content: "Pretty good! Just finishing up the design system documentation", timestamp: "2:18 PM", isSent: true, status: "read" },
    { id: "3", content: "That's awesome. Would love to review it when you're done", timestamp: "2:22 PM", isSent: false },
    { id: "4", content: "Of course! I should have it ready by end of day. Want to hop on a quick call to walk through it?", timestamp: "2:25 PM", isSent: true, status: "read" },
    { id: "5", content: "That sounds great! Let me know when you're free", timestamp: "2:34 PM", isSent: false },
    { id: "55", content: "That sounds great! Let me know when you're free", timestamp: "2:34 PM", isSent: true, status: "read" },
    { id: "23", content: "SDFGJSKLDFEJRGEIJRSDFGLSEKJRKLEWJRLKJSDLKFJGLSKDFJLSDFJGLKSDJGKLSDJGLKSDJFGKLEJRGJSDLKFJGLSKDJGLKSDFJGLKSDJGSLDKFGJSDLKFGJSDLKFJSLDKFGJSLDKFJLSKDFGJLSKDFJGLKSDFGKLSDJJKLJFLKJKLJLKJ", timestamp: "2:34 PM", isSent: true, status: "read" },
    { id: "25", content: "SDFGJSKLDFEJRGEIJRSDFGLSEKJRKLEWJRLKJSDLKFJGLSKDFJLSDFJGLKSDJGKLSDJGLKSDJFGKLEJRGJSDLKFJGLSKDJGLKSDFJGLKSDJGSLDKFGJSDLKFGJSDLKFJSLDKFGJSLDKFJLSKDFGJLSKDFJGLKSDFGKLSDJJKLJFLKJKLJLKJ", timestamp: "2:34 PM", isSent: false, status: "read" },
  ],
  "2": [
    { id: "1", content: "Did you get a chance to look at the proposal?", timestamp: "12:45 PM", isSent: true, status: "read" },
    { id: "2", content: "Yes! I have some feedback. The overall structure looks solid but I think we need to expand on the timeline section", timestamp: "1:02 PM", isSent: false },
    { id: "3", content: "Good point. I'll revise that section and add more detail", timestamp: "1:10 PM", isSent: true, status: "read" },
    { id: "4", content: "I'll send over the files tonight", timestamp: "1:15 PM", isSent: false },
  ],
  "3": [
    { id: "1", content: "Quick heads up - the stakeholder meeting got rescheduled", timestamp: "11:30 AM", isSent: false },
    { id: "2", content: "Oh no, what time is it now?", timestamp: "11:35 AM", isSent: true, status: "read" },
    { id: "3", content: "Meeting moved to 3pm tomorrow", timestamp: "11:42 AM", isSent: false },
  ],
}

const users: Record<string, ChatUser> = {
  "1": { id: "1", name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", isOnline: true },
  "2": { id: "2", name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", isOnline: true },
  "3": { id: "3", name: "Jordan Taylor", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop", isOnline: false, lastSeen: "Last seen 2h ago" },
  "4": { id: "4", name: "Design Team", avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop", isOnline: false },
  "5": { id: "5", name: "Emma Watson", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", isOnline: false, lastSeen: "Last seen yesterday" },
  "6": { id: "6", name: "Marcus Johnson", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", isOnline: true },
  "7": { id: "7", name: "Engineering", avatar: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=100&h=100&fit=crop", isOnline: false },
}

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

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState(sampleConversations)
  const [messages, setMessages] = useState(sampleMessages)

  const selectedUser = selectedConversationId ? users[selectedConversationId] : null
  const currentMessages = selectedConversationId ? messages[selectedConversationId] || [] : []

  const handleSelectConversation = useCallback((id: string) => {
    setSelectedConversationId(id)
    console.log(id)
    setConversations((prev) =>
      prev.map((conv) => (conv.id === id ? { ...conv, unreadCount: 0 } : conv))
    )
  }, [])

  const handleBack = useCallback(() => {
    setSelectedConversationId(null)
  }, [])

  const handleSendMessage = useCallback((content: string) => {
    if (!selectedConversationId) return
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSent: true,
      status: "sent",
    }
    setMessages((prev) => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] || []), newMessage],
    }))
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversationId
          ? { ...conv, lastMessage: content, timestamp: "Just now" }
          : conv
      )
    )
  }, [selectedConversationId])

  const handleNewChat = useCallback((user: SearchableUser, isExisting: boolean) => {
    if (isExisting) {
      // Open existing conversation
      setSelectedConversationId(user.id)
      setConversations((prev) =>
        prev.map((conv) => (conv.id === user.id ? { ...conv, unreadCount: 0 } : conv))
      )
    } else {
      // Create new conversation
      const newConversation: Conversation = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        lastMessage: "Start a conversation...",
        timestamp: "Now",
        unreadCount: 0,
        isOnline: user.isOnline || false,
      }
      setConversations((prev) => [newConversation, ...prev])
      setMessages((prev) => ({ ...prev, [user.id]: [] }))
      setSelectedConversationId(user.id)
    }
  }, [])

  const existingConversationIds = conversations.map((c) => c.id)

  return (
    <div className="relative flex h-[100dvh] w-screen overflow-hidden bg-background">

      {/* ── SIDEBAR ──────────────────────────────────────────────────
          Mobile  : fills viewport, slides off-left when chat is open
          Desktop : static column, fixed width, never moves            */}
      <aside
        className={[
          "h-full flex-shrink-0",
          // mobile only
          "max-md:absolute max-md:inset-0 max-md:z-20 max-md:w-full max-md:transition-transform max-md:duration-300 max-md:ease-in-out",
          selectedConversationId ? "max-md:-translate-x-full" : "max-md:translate-x-0",
          // desktop only
          "md:relative md:w-80 lg:w-96",
        ].join(" ")}
      >
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversationId}
          onSelect={handleSelectConversation}
          newChatButton={
            <NewChatModal
              users={allSearchableUsers}
              existingConversationIds={existingConversationIds}
              onSelectUser={handleNewChat}
            />
          }
        />
      </aside>

      {/* ── CHAT PANEL ───────────────────────────────────────────────
          Mobile  : fills viewport, slides in from right when selected
          Desktop : fills remaining space beside the sidebar           */}
      <main
        className={[
          "flex flex-col flex-1 min-w-0 h-full",
          // mobile only
          "max-md:absolute max-md:inset-0 max-md:z-20 max-md:transition-transform max-md:duration-300 max-md:ease-in-out",
          selectedConversationId ? "max-md:translate-x-0" : "max-md:translate-x-full",
        ].join(" ")}
      >
        <ChatWindow
          user={selectedUser}
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          onBack={handleBack}
        />
      </main>

    </div>
  )
}
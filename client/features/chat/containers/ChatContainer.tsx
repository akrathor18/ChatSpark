"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChatWindow as ChatWindowLayout } from "../components/chat-window"
import { useConversationStore } from "../store/useConversationStore"
import { useMessageStore } from "../store/useMessageStore"
import { VirtuosoHandle } from "react-virtuoso"

export interface Message {
    id: string
    content: string
    timestamp: string
    isSent: boolean
    status?: "sending" | "sent" | "read" | "failed"
}

export interface ChatUser {
    id: string
    name: string
    email: string
    avatar: string
    isOnline: boolean
    lastSeen?: string
}

interface ChatContainerProps {
    user: ChatUser | null
    messages: Message[]
    onSendMessage: (content: string) => void
    onTyping?: () => void
    onBack?: () => void
    onDeleteChat?: () => void
    isBlockedByMe?: boolean
    isBlockedMe?: boolean
    onBlockUser?: () => void
    onUnblockUser?: () => void
}

export function ChatContainer({
    user,
    messages,
    onSendMessage,
    onTyping,
    onBack,
    onDeleteChat,
    isBlockedByMe,
    isBlockedMe,
    onBlockUser,
    onUnblockUser,
}: ChatContainerProps) {
    // ── State ──────────────────────────────────────────────────────────────────
    const [inputValue, setInputValue] = useState("")
    const { typingUsers, selectedConversationId } = useConversationStore();
    const { fetchOlderMessages, isLoadingOlder, hasMore, isLoading } = useMessageStore();

    // Calculate if others are typing
    const isOtherTyping = !!(selectedConversationId && Object.keys(typingUsers[selectedConversationId] || {}).length > 0);

    // ── Refs ───────────────────────────────────────────────────────────────────
    const virtuosoRef = useRef<VirtuosoHandle>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    // ── Handlers ───────────────────────────────────────────────────────────────

    const handleLoadOlder = useCallback(() => {
        if (selectedConversationId) {
            fetchOlderMessages(selectedConversationId);
        }
    }, [selectedConversationId, fetchOlderMessages]);

    const handleSend = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue.trim())
            setInputValue("")
            
            // Explicitly scroll to bottom on send
            setTimeout(() => {
                virtuosoRef.current?.scrollToIndex({
                    index: messages.length,
                    align: 'end',
                    behavior: 'smooth'
                })
            }, 100)

            if (inputRef.current) {
                inputRef.current.style.height = "auto"
                inputRef.current.focus()
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const el = e.target
        el.style.height = "auto"
        el.style.height = `${Math.min(el.scrollHeight, 128)}px`
        setInputValue(el.value)
        
        // Trigger typing indicator
        if (onTyping) onTyping()
    }

    return (
        <ChatWindowLayout
            user={user}
            messages={messages}
            inputValue={inputValue}
            setInputValue={setInputValue}
            virtuosoRef={virtuosoRef}
            inputRef={inputRef}
            onSend={handleSend}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBack={onBack}
            onDeleteChat={onDeleteChat}
            onLoadOlder={handleLoadOlder}
            isLoadingOlder={isLoadingOlder}
            hasMore={!!(selectedConversationId && hasMore[selectedConversationId])}
            isLoading={isLoading}
            isBlockedByMe={isBlockedByMe}
            isBlockedMe={isBlockedMe}
            onBlockUser={onBlockUser}
            onUnblockUser={onUnblockUser}
        />
    )
}
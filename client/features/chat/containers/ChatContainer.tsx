"use client"

import { useState, useRef, useEffect } from "react"
import { ChatWindow as ChatWindowLayout } from "../components/chat-window"
import { useConversationStore } from "../store/useConversationStore"

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
}

export function ChatContainer({
    user,
    messages,
    onSendMessage,
    onTyping,
    onBack,
}: ChatContainerProps) {
    // ── State ──────────────────────────────────────────────────────────────────
    const [inputValue, setInputValue] = useState("")
    const { typingUsers, selectedConversationId } = useConversationStore();

    // Calculate if others are typing to trigger scroll
    const isOtherTyping = !!(selectedConversationId && Object.keys(typingUsers[selectedConversationId] || {}).length > 0);

    // ── Refs (passed down so the layout can attach them to DOM nodes) ──────────
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    // ── Effects ────────────────────────────────────────────────────────────────

    // Intelligent "Stick-to-bottom" scrolling
    useEffect(() => {
        const container = scrollContainerRef.current
        if (!container || messages.length === 0) return

        const lastMessage = messages[messages.length - 1]
        
        // 1. If the message was sent by the user, always scroll to bottom
        if (lastMessage.isSent) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
            // Secondary check after rendering
            setTimeout(() => {
                container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
            }, 100);
            return;
        }

        // 2. If it's a typing indicator or a received message
        // Scroll only if the user was already near the bottom
        const threshold = 200; // Increased threshold for better tolerance
        const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + threshold;

        if (isNearBottom) {
            // Use requestAnimationFrame + setTimeout for robust rendering sync
            requestAnimationFrame(() => {
                setTimeout(() => {
                    container.scrollTo({
                        top: container.scrollHeight,
                        behavior: 'smooth'
                    });
                }, 50);
            });
        }
    }, [messages, isOtherTyping])

    // ── Handlers ───────────────────────────────────────────────────────────────

    const handleSend = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue.trim())
            setInputValue("")
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
            scrollContainerRef={scrollContainerRef}
            messagesEndRef={messagesEndRef}
            inputRef={inputRef}
            onSend={handleSend}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBack={onBack}
        />
    )
}
"use client"

import { useState, useRef, useEffect } from "react"
import { ChatWindow as ChatWindowLayout } from "../components/chat-window"

// ─── Shared types ────────────────────────────────────────────────────────────
// Exported so ChatWindowLayout (and any other consumer) can import them
// from a single source of truth.

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

// ─── Container props ──────────────────────────────────────────────────────────

interface ChatContainerProps {
    user: ChatUser | null
    messages: Message[]
    onSendMessage: (content: string) => void
    onBack?: () => void
}

// ─── Container ────────────────────────────────────────────────────────────────
// Owns ALL stateful and side-effect logic.
// Renders nothing itself — delegates every pixel to ChatWindowLayout.

export function ChatContainer({
    user,
    messages,
    onSendMessage,
    onBack,
}: ChatContainerProps) {
    // ── State ──────────────────────────────────────────────────────────────────
    const [inputValue, setInputValue] = useState("")

    // ── Refs (passed down so the layout can attach them to DOM nodes) ──────────
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    // ── Effects ────────────────────────────────────────────────────────────────

    // Auto-scroll to the latest message whenever the list changes.
    useEffect(() => {
        const container = scrollContainerRef.current
        if (container) {
            container.scrollTop = container.scrollHeight
        }
    }, [messages])

    // ── Handlers ───────────────────────────────────────────────────────────────

    const handleSend = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue.trim())
            setInputValue("")
            inputRef.current?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    // Auto-grow the textarea up to 8 lines (~128 px) as the user types.
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const el = e.target
        el.style.height = "auto"
        el.style.height = `${Math.min(el.scrollHeight, 128)}px`
        setInputValue(el.value)
    }

    // ── Render ─────────────────────────────────────────────────────────────────
    // The container's only JSX is handing everything off to the layout.

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
"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChatWindow as ChatWindowLayout } from "../components/chat-window"
import { MessageInfoModal } from "../components/message-info-modal"
import { useConversationStore } from "../store/useConversationStore"
import { useMessageStore } from "../store/useMessageStore"
import * as messageService from "../services/message.service"
import { getSocket } from "@/lib/socket"
import { VirtuosoHandle } from "react-virtuoso"

export interface Message {
    id: string
    content: string
    timestamp: string
    createdAt: string
    isSent: boolean
    status?: "sending" | "sent" | "read" | "failed"
    isUnsent?: boolean
    replyTo?: {
        id: string
        content: string
        senderName?: string
        isUnsent?: boolean
    }
    senderId?: string
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
    onSendMessage: (content: string, replyToId?: string) => void
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
    const [infoMessageId, setInfoMessageId] = useState<string | null>(null)
    const [isInfoOpen, setIsInfoOpen] = useState(false)
    const { typingUsers, selectedConversationId, replyingTo, setReplyingTo } = useConversationStore();
    const { fetchOlderMessages, isLoadingOlder, hasMore, isLoading, removeMessage, markAsUnsent } = useMessageStore();

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
            onSendMessage(inputValue.trim(), replyingTo?.id)
            setInputValue("")
            
            // Clear reply state after sending
            if (replyingTo) {
                setReplyingTo(null)
            }

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

    // ── Context Menu Handlers ──────────────────────────────────────────────────

    const handleReply = useCallback((message: Message) => {
        setReplyingTo(message)
        // Focus input when replying
        setTimeout(() => {
            inputRef.current?.focus()
        }, 100)
    }, [setReplyingTo])

    const handleCancelReply = useCallback(() => {
        setReplyingTo(null)
    }, [setReplyingTo])

    const handleCopyMessage = useCallback(async (content: string) => {
        try {
            await navigator.clipboard.writeText(content)
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement("textarea")
            textarea.value = content
            textarea.style.position = "fixed"
            textarea.style.opacity = "0"
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand("copy")
            document.body.removeChild(textarea)
        }
    }, [])

    const handleUnsendMessage = useCallback(async (messageId: string) => {
        if (!selectedConversationId) return

        try {
            // Optimistic update
            markAsUnsent(selectedConversationId, messageId)
            
            // Also emit via socket for real-time broadcast
            const socket = getSocket()
            const userId = useConversationStore.getState().selectedConversationUser?.user?.id
            socket.emit("unsend_message", {
                conversationId: selectedConversationId,
                messageId,
                senderId: userId,
            })
        } catch (err) {
            console.error("Failed to unsend message:", err)
        }
    }, [selectedConversationId, markAsUnsent])

    const handleDeleteMessage = useCallback(async (messageId: string) => {
        if (!selectedConversationId) return

        try {
            // Optimistic update — remove from local state immediately
            removeMessage(selectedConversationId, messageId)
            
            // Persist to backend
            await messageService.deleteMessageForMe(messageId)
        } catch (err) {
            console.error("Failed to delete message:", err)
        }
    }, [selectedConversationId, removeMessage])

    const handleMessageInfo = useCallback((messageId: string) => {
        setInfoMessageId(messageId)
        setIsInfoOpen(true)
    }, [])

    return (
        <>
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
                replyingTo={replyingTo}
                onReply={handleReply}
                onCancelReply={handleCancelReply}
                onCopyMessage={handleCopyMessage}
                onUnsendMessage={handleUnsendMessage}
                onDeleteMessage={handleDeleteMessage}
                onMessageInfo={handleMessageInfo}
            />
            <MessageInfoModal
                messageId={infoMessageId}
                open={isInfoOpen}
                onOpenChange={setIsInfoOpen}
            />
        </>
    )
}
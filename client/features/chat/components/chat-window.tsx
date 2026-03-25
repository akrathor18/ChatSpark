"use client"

import { useRef, useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import {
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Smile,
  Send,
  ImageIcon,
  Check,
  CheckCheck,
  Sparkles,
  ArrowLeft,
  Clock,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message, ChatUser } from "../containers/ChatContainer"
import { useConversationStore } from "../store/useConversationStore"

interface ChatWindowLayoutProps {
  user: ChatUser | null
  messages: Message[]
  inputValue: string
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  inputRef: React.RefObject<HTMLTextAreaElement | null>
  onSend: () => void
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onBack?: () => void
}

export function ChatWindow({
  user,
  messages,
  inputValue,
  scrollContainerRef,
  messagesEndRef,
  inputRef,
  onSend,
  onInputChange,
  onKeyDown,
  onBack,
}: ChatWindowLayoutProps) {
  const { typingUsers, selectedConversationId } = useConversationStore();

  const isOtherTyping = useMemo(() => {
    if (!selectedConversationId) return false;
    const typers = typingUsers[selectedConversationId] || {};
    return Object.keys(typers).length > 0;
  }, [typingUsers, selectedConversationId]);

  if (!user) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <Sparkles className="h-9 w-9 text-primary" />
        </div>
        <h2 className="mt-6 text-xl font-semibold text-foreground">Welcome to ChatSpark</h2>
        <p className="mt-2 max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
          Select a conversation to start messaging with your team.
        </p>
        <div className="mt-8 flex items-center gap-2 rounded-lg bg-secondary/50 px-4 py-2 ring-1 ring-border/50">
          <kbd className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">Ctrl</kbd>
          <span className="text-xs text-muted-foreground">+</span>
          <kbd className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">K</kbd>
          <span className="text-xs text-muted-foreground">to search</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-background">
    {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-border bg-card/50 px-4 py-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="mr-1 h-9 w-9 rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground md:hidden"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-border">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-secondary text-sm font-medium text-foreground">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {user.isOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-[var(--online)]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-foreground">{user.name}</h2>
                <span className="text-[10px] text-muted-foreground/60">• {user.email}</span>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {user.isOnline ? (
                <>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--online)]" />
                  Active now
                </>
              ) : (
                user.lastSeen ? `Last seen ${new Date(user.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "Offline"
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground">
            <Phone className="h-4 w-4" />
            <span className="sr-only">Voice call</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground">
            <Video className="h-4 w-4" />
            <span className="sr-only">Video call</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain px-4 py-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex min-h-full flex-col justify-end gap-2">
          {messages.map((message, index) => {
            const prevSame = index > 0 && messages[index - 1].isSent === message.isSent
            const nextSame = index < messages.length - 1 && messages[index + 1].isSent === message.isSent
            const isLast = index === messages.length - 1

            return (
              <div
                key={message.id || index}
                className={cn(
                  "flex",
                  message.isSent ? "justify-end" : "justify-start",
                  prevSame ? "mt-0.5" : "mt-3"
                )}
              >
                <div className={cn(
                  "flex min-w-0 max-w-[78%] flex-col sm:max-w-[65%]",
                  message.isSent ? "items-end" : "items-start"
                )}>

                  <div
                    className={cn(
                      "w-full break-words px-4 py-2.5 text-[14px] leading-relaxed shadow-sm",
                      message.isSent
                        ? "rounded-2xl rounded-br-md bg-[var(--message-sent)] text-[var(--message-sent-foreground)]"
                        : "rounded-2xl rounded-bl-md bg-[var(--message-received)] text-[var(--message-received-foreground)] ring-1 ring-border/40",
                      prevSame && message.isSent && "rounded-tr-md",
                      prevSame && !message.isSent && "rounded-tl-md",
                      nextSame && message.isSent && "rounded-br-md",
                      nextSame && !message.isSent && "rounded-bl-md",
                      message.status === "failed" && "bg-destructive/10 ring-1 ring-destructive/20 text-destructive-foreground dark:text-destructive"
                    )}
                  >
                    {message.content}
                  </div>
                  {(!nextSame || isLast) && (
                    <div
                      className={cn(
                        "mt-1 flex items-center gap-1 text-[11px] text-muted-foreground",
                        message.isSent ? "justify-end pr-1" : "pl-1"
                      )}
                    >
                      <span>{message.timestamp}</span>
                      {message.isSent && (
                        <span className={cn(
                          message.status === "read" ? "text-primary" : "text-muted-foreground",
                          message.status === "failed" && "text-destructive"
                        )}>
                          {message.status === "read" ? (
                            <CheckCheck className="h-3.5 w-3.5" />
                          ) : message.status === "sending" ? (
                            <Clock className="h-3.2 w-3.2 animate-pulse" />
                          ) : message.status === "failed" ? (
                            <AlertCircle className="h-3.5 w-3.5" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          
          {/* Typing Indicator */}
          {isOtherTyping && (
            <div className="flex justify-start mt-1">
              <div className="flex flex-col items-start">
                <div className="rounded-2xl rounded-bl-md bg-[var(--message-received)] px-4 py-2.5 shadow-sm ring-1 ring-border/40">
                  <div className="flex items-center gap-1">
                    <span className="typing-dot" />
                    <span className="typing-dot delay-150" />
                    <span className="typing-dot delay-300" />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border bg-card/30 p-3 pb-safe">
        <div className="flex items-end gap-2 rounded-2xl bg-input px-3 py-2 ring-1 ring-border/50 transition-all duration-200 focus-within:ring-primary/40">
          <div className="flex shrink-0 items-center gap-0.5 pb-0.5">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground">
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button variant="ghost" size="icon" className="hidden h-8 w-8 rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground sm:flex">
              <ImageIcon className="h-4 w-4" />
              <span className="sr-only">Send image</span>
            </Button>
          </div>
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="max-h-32 min-h-[36px] flex-1 resize-none bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            style={{ lineHeight: "1.5" }}
          />
          <div className="flex shrink-0 items-center gap-0.5 pb-0.5">
            <Button variant="ghost" size="icon" className="hidden h-8 w-8 rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground sm:flex">
              <Smile className="h-4 w-4" />
              <span className="sr-only">Add emoji</span>
            </Button>
            <Button
              onClick={onSend}
              disabled={!inputValue.trim()}
              size="icon"
              className="h-8 w-8 rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/30 transition-all duration-200 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/40 disabled:opacity-40 disabled:shadow-none"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
        <p className="mt-2 hidden text-center text-[11px] text-muted-foreground/60 sm:block">
          Press{" "}
          <kbd className="rounded bg-secondary/80 px-1 py-0.5 font-mono text-[10px]">Enter</kbd> to send,{" "}
          <kbd className="rounded bg-secondary/80 px-1 py-0.5 font-mono text-[10px]">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  )
}
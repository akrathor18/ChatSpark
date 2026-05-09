"use client"

import { useRef, useMemo, memo, useCallback } from "react"
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  Trash2,
  ShieldBan,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message, ChatUser } from "../containers/ChatContainer"
import { useConversationStore } from "../store/useConversationStore"
import { MessageContent, detectRawCode } from "./message-content"
import { DateSeparator } from "./date-separator"
import { isDifferentDay, getDateLabel } from "../utils/formatMessageTime"
import NoMessage from "./no-message"
interface ChatWindowLayoutProps {
  user: ChatUser | null
  messages: Message[]
  inputValue: string
  setInputValue: (value: string) => void
  virtuosoRef: React.RefObject<VirtuosoHandle | null>
  inputRef: React.RefObject<HTMLTextAreaElement | null>
  onSend: () => void
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onBack?: () => void
  onDeleteChat?: () => void
  onLoadOlder?: () => void
  isLoadingOlder?: boolean
  hasMore?: boolean
  isLoading?: boolean
  isBlockedByMe?: boolean
  isBlockedMe?: boolean
  onBlockUser?: () => void
  onUnblockUser?: () => void
}

export function ChatWindow({
  user,
  messages,
  inputValue,
  virtuosoRef,
  inputRef,
  onSend,
  onInputChange,
  onKeyDown,
  onBack,
  onDeleteChat,
  onLoadOlder,
  isLoadingOlder,
  hasMore,
  isLoading,
  setInputValue,
  isBlockedByMe,
  isBlockedMe,
  onBlockUser,
  onUnblockUser,
}: ChatWindowLayoutProps) {
  const { typingUsers, selectedConversationId } = useConversationStore()

  const isOtherTyping = useMemo(() => {
    if (!selectedConversationId) return false
    const typers = typingUsers[selectedConversationId] || {}
    return Object.keys(typers).length > 0
  }, [typingUsers, selectedConversationId])

  if (!user) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-background/50">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <Sparkles className="h-9 w-9 text-primary" />
        </div>
        <h2 className="mt-6 text-xl font-semibold text-foreground">
          Welcome to ChatSpark
        </h2>
        <p className="mt-2 max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
          Select a conversation to start messaging with your team.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-background overflow-hidden relative">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-border bg-card/50 px-4 py-3 z-10">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="mr-1 h-9 w-9 rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground md:hidden"
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
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-online" />
            )}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground truncate max-w-[120px] sm:max-w-none">
              {user.name}
            </h2>
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              {user.isOnline ? "Active now" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground"><Phone className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground"><Video className="h-4 w-4" /></Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {isBlockedByMe ? (
                <DropdownMenuItem
                  onClick={onUnblockUser}
                  className="cursor-pointer"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Unblock User
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={onBlockUser}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                >
                  <ShieldBan className="mr-2 h-4 w-4" />
                  Block User
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={onDeleteChat}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 min-h-0 bg-background/50 relative">
        {isLoading && messages.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
              <Clock className="h-4 w-4 animate-spin" />
              <span>Loading messages...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <NoMessage user={user} onSendMessage={setInputValue} />
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            style={{ height: "100%" }}
            data={messages}
            increaseViewportBy={{ top: 300, bottom: 300 }}
            initialTopMostItemIndex={Math.max(0, messages.length - 1)}
            followOutput="smooth"
            alignToBottom
            startReached={() => {
              onLoadOlder?.();
            }}
            itemContent={(index, message) => {
              const firstIdx = 100000 - messages.length
              const arrayIndex = index - firstIdx
              const prev = messages[arrayIndex - 1]
              const next = messages[arrayIndex + 1]
              const showDateSeparator = isDifferentDay(
                prev?.createdAt,
                message.createdAt
              )

              return (
                <>
                  {showDateSeparator && (
                    <DateSeparator label={getDateLabel(message.createdAt)} />
                  )}
                  <MessageItem
                    message={message}
                    prevSame={!showDateSeparator && prev?.isSent === message.isSent}
                    nextSame={next?.isSent === message.isSent && !isDifferentDay(message.createdAt, next?.createdAt)}
                    isLast={arrayIndex === messages.length - 1}
                  />
                </>
              )
            }}

            components={{
              Header: () => (
                <div className="flex h-10 items-center justify-center">
                  {isLoadingOlder && (
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground animate-pulse">
                      <Clock className="h-3 w-3 animate-spin" />
                      <span>Loading history...</span>
                    </div>
                  )}
                </div>
              ),
              Footer: () => (
                <div className="pb-4">
                  {isOtherTyping && (
                    <div className="mt-1 px-4 flex justify-start">
                      <div className="flex flex-col items-start">
                        <div className="rounded-2xl rounded-bl-md bg-secondary px-4 py-3 shadow-sm ring-1 ring-border/40">
                          <div className="flex items-center gap-1.5 font-medium text-xs text-muted-foreground">
                            Typing...
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ),
            }}
            firstItemIndex={100000 - messages.length}
          />
        )}
      </div>

      {/* Input / Blocked Banner */}
      {isBlockedByMe ? (
        <div className="shrink-0 border-t border-border bg-card/30 p-3 pb-safe z-10">
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-destructive/5 border border-destructive/20 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <ShieldBan className="h-4 w-4 text-destructive shrink-0" />
              <span className="text-sm text-muted-foreground">
                You blocked this user
              </span>
            </div>
            <Button
              onClick={onUnblockUser}
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-xs font-medium text-primary hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              Unblock
            </Button>
          </div>
        </div>
      ) : isBlockedMe ? (
        <div className="shrink-0 border-t border-border bg-card/30 p-3 pb-safe z-10">
          <div className="flex items-center gap-2.5 rounded-2xl bg-secondary/80 border border-border px-4 py-3">
            <ShieldBan className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground">
              You can&apos;t send messages to this user
            </span>
          </div>
        </div>
      ) : (
        <div className="shrink-0 border-t border-border bg-card/30 p-3 pb-safe z-10">
          <div className="flex items-end gap-2 rounded-2xl bg-input px-3 py-2 ring-1 ring-border/50 focus-within:ring-primary/40 transition-all duration-200">
            <div className="flex shrink-0 items-center gap-0.5 pb-0.5">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground"><Paperclip className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="hidden h-8 w-8 rounded-lg text-muted-foreground sm:flex"><ImageIcon className="h-4 w-4" /></Button>
            </div>
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="max-h-32 min-h-[36px] flex-1 resize-none bg-transparent py-1.5 text-sm text-foreground focus:outline-none"
              style={{ lineHeight: "1.5" }}
            />
            <div className="flex shrink-0 items-center gap-0.5 pb-0.5">
              <Button variant="ghost" size="icon" className="hidden h-8 w-8 rounded-lg text-muted-foreground sm:flex"><Smile className="h-4 w-4" /></Button>
              <Button
                onClick={onSend}
                disabled={!inputValue.trim()}
                size="icon"
                className="h-8 w-8 rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/30 hover:bg-primary/90 hover:shadow-md transition-all duration-200 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const MessageItem = memo(({
  message,
  prevSame,
  nextSame,
  isLast
}: {
  message: Message;
  prevSame: boolean;
  nextSame: boolean;
  isLast: boolean;
}) => {
  const { isCode } = useMemo(() => detectRawCode(message.content || ""), [message.content])

  return (
    <div
      className={cn(
        "flex px-4 py-0",
        message.isSent ? "justify-end" : "justify-start",
        prevSame ? "mt-0.5" : "mt-3"
      )}
    >
      <div
        className={cn(
          "flex min-w-0 max-w-[85%] flex-col sm:max-w-[70%]",
          message.isSent ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "w-full break-words text-[14px] leading-relaxed transition-all duration-200",
            !isCode && "px-4 py-2.5 shadow-sm",
            !isCode && (message.isSent
              ? "rounded-2xl rounded-br-md bg-primary text-primary-foreground font-medium"
              : "rounded-2xl rounded-bl-md bg-secondary text-foreground ring-1 ring-border/40"),
            !isCode && prevSame && message.isSent && "rounded-tr-md",
            !isCode && prevSame && !message.isSent && "rounded-tl-md",
            !isCode && nextSame && message.isSent && "rounded-br-md",
            !isCode && nextSame && !message.isSent && "rounded-bl-md"
          )}
        >
          <MessageContent
            content={message.content}
            isSent={message.isSent}
          />
        </div>

        {(!nextSame || isLast) && (
          <div
            className={cn(
              "mt-1 flex items-center gap-1 text-[10px] text-muted-foreground",
              message.isSent ? "justify-end pr-1" : "pl-1"
            )}
          >
            <span>{message.timestamp}</span>
            {message.isSent && (
              <span className={cn(message.status === "read" ? "text-primary" : "text-muted-foreground")}>
                {message.status === "read" ? (
                  <CheckCheck className="h-3 w-3" />
                ) : message.status === "sending" ? (
                  <Clock className="h-3 w-3 animate-pulse" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
})

MessageItem.displayName = "MessageItem"
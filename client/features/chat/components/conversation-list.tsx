"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Sparkles, Plus, Settings, X, MoreVertical, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"

// Updated to match API response shape
export interface Conversation {
  conversationId: string
  type: "direct" | "group"
  user: {
    _id: string
    name: string
    email: string
    avatar?: string
  } | null
  lastMessage?: string
  lastMessageAt?: string
  unreadCount?: number
  isOnline?: boolean
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  newChatButton?: React.ReactNode
  user: any
}

export function ConversationList({ conversations, selectedId, onSelect, onDelete, newChatButton, user }: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredConversations = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return conversations

    return conversations.filter((conv) => {
      const name = conv.user?.name?.toLowerCase() ?? ""
      return name.includes(term)
    })
  }, [conversations, searchTerm])

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
            <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-foreground">ChatSpark</h1>
            <p className="text-[11px] text-muted-foreground">Developer Chat</p>
          </div>
        </div>
        {newChatButton || (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-lg text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
          >
            <Plus className="h-4.5 w-4.5" />
            <span className="sr-only">New chat</span>
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2.5 rounded-xl bg-input px-3.5 py-2.5 ring-1 ring-border/50 transition-all duration-200 focus-within:ring-primary/50">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm("")}
              className="rounded-md p-0.5 hover:bg-secondary"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          ) : (
            <kbd className="hidden rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
              /
            </kbd>
          )}
        </div>
      </div>

      {/* Section Label */}
      <div className="px-5 py-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Messages
        </span>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-2" style={{ WebkitOverflowScrolling: "touch" }}>
        <div className="space-y-0.5 pb-4">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => {
              // Destructure API fields
              const { conversationId, user, lastMessage, lastMessageAt, unreadCount = 0,  } = conversation
              const isOnline = conversation.isOnline || false;

              const name = user?.name ?? "Unknown"
              const avatar = user?.avatar ?? ""
              const timestamp = lastMessageAt
                ? new Date(lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : ""

              return (
                <button
                  key={conversationId}
                  onClick={() => onSelect(conversationId)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200",
                    selectedId === conversationId
                      ? "bg-sidebar-accent shadow-sm"
                      : "hover:bg-sidebar-accent/50"
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-11 w-11 ring-2 ring-transparent transition-all duration-200 group-hover:ring-primary/20">
                      <AvatarImage src={avatar} alt={name} />
                      <AvatarFallback className="bg-secondary text-sm font-medium text-foreground">
                        {name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-sidebar bg-online shadow-sm shadow-online/50" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn(
                        "truncate text-sm transition-colors duration-200",
                        selectedId === conversationId || unreadCount > 0
                          ? "font-semibold text-foreground"
                          : "font-medium text-foreground/90"
                      )}>
                        {name}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className={cn(
                          "text-[11px] transition-colors duration-200",
                          unreadCount > 0 ? "font-medium text-primary" : "text-muted-foreground"
                        )}>
                          {timestamp}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="h-6 w-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-secondary"
                            >
                              <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(conversationId);
                              }}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Chat
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <p className={cn(
                        "truncate text-[13px] transition-colors duration-200",
                        unreadCount > 0 ? "text-foreground/80" : "text-muted-foreground"
                      )}>
                        {lastMessage ?? "No messages yet"}
                      </p>
                      {unreadCount > 0 && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground shadow-sm shadow-primary/30">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm font-medium text-muted-foreground">No conversations found</p>
              <p className="text-xs text-muted-foreground/70">Try a different search term</p>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/profile"
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-sidebar-accent"
        >
           <Avatar className="h-11 w-11 ring-2 ring-transparent transition-all duration-200 group-hover:ring-primary/20">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-secondary text-sm font-medium text-foreground">
                      {user?.name?.slice(0, 2)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{user?.name || "User"}</p>
            <p className="truncate text-xs font-medium text-foreground">{user?.email || "user@example.com"}</p>
            <p className="truncate text-xs text-muted-foreground">View profile</p>
          </div>
          <Settings className="h-4 w-4 text-muted-foreground transition-colors duration-200 group-hover:text-foreground" />
        </Link>
      </div>
    </div>
  )
}
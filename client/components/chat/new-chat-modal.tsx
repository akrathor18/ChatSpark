"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Plus, Mail, Loader2, UserPlus, Sparkles } from "lucide-react"

export interface SearchableUser {
  id: string
  name: string
  email: string
  avatar: string
  isOnline?: boolean
}

interface NewChatModalProps {
  users: SearchableUser[]
  existingConversationIds: string[]
  onSelectUser: (user: SearchableUser, isExisting: boolean) => void
  trigger?: React.ReactNode
}

export function NewChatModal({
  users,
  existingConversationIds,
  onSelectUser,
  trigger,
}: NewChatModalProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState<SearchableUser[]>([])

  // Simulate search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const timeout = setTimeout(() => {
      const query = searchQuery.toLowerCase()
      const results = users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      )
      setFilteredUsers(results)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchQuery, users])

  const handleSelectUser = useCallback(
    (user: SearchableUser) => {
      const isExisting = existingConversationIds.includes(user.id)
      onSelectUser(user, isExisting)
      setOpen(false)
      setSearchQuery("")
      setFilteredUsers([])
    },
    [existingConversationIds, onSelectUser]
  )

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      setSearchQuery("")
      setFilteredUsers([])
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-lg text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
          >
            <Plus className="h-4.5 w-4.5" />
            <span className="sr-only">New chat</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
              <UserPlus className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold tracking-tight">
                New Conversation
              </DialogTitle>
              <p className="text-[11px] text-muted-foreground">
                Search by name or email address
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Search Input */}
        <div className="border-b border-border px-4 py-3">
          <div className="flex items-center gap-2.5 rounded-xl bg-input px-3.5 py-2.5 ring-1 ring-border/50 transition-all duration-200 focus-within:ring-primary/50">
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Mail className="h-4 w-4 text-muted-foreground" />
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter email or name..."
              autoFocus
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <kbd className="hidden rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
              Esc
            </kbd>
          </div>
        </div>

        {/* Results */}
        <div
          className="max-h-72 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {!searchQuery.trim() ? (
            <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Find someone to chat with
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Start typing to search users by name or email
              </p>
            </div>
          ) : isSearching ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
                <Sparkles className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No users found</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try a different name or email address
              </p>
            </div>
          ) : (
            <div className="space-y-0.5 p-2">
              {filteredUsers.map((user) => {
                const isExisting = existingConversationIds.includes(user.id)
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 hover:bg-secondary"
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-10 w-10 ring-2 ring-transparent transition-all duration-200 group-hover:ring-primary/20">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-muted text-sm font-medium text-foreground">
                          {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {user.isOnline && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-popover bg-online shadow-sm shadow-online/50" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-foreground">
                          {user.name}
                        </span>
                        {isExisting && (
                          <span className="shrink-0 rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                            Existing
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <div className="shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Plus className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-border bg-secondary/30 px-4 py-2.5">
          <p className="text-center text-[11px] text-muted-foreground">
            <kbd className="rounded bg-secondary px-1 py-0.5 font-mono text-[10px]">
              Enter
            </kbd>{" "}
            to select{" "}
            <span className="mx-1.5 text-border">|</span>{" "}
            <kbd className="rounded bg-secondary px-1 py-0.5 font-mono text-[10px]">
              Esc
            </kbd>{" "}
            to close
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}


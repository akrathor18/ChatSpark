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
      <DialogContent
        className="gap-0 overflow-hidden p-0 flex flex-col max-h-[calc(100dvh-4rem)] w-[calc(100%-2rem)] sm:mx-auto sm:max-w-md"
      >
        {/* Header — fixed, never scrolls */}
        <DialogHeader className="border-b border-border px-4 py-3 sm:px-5 sm:py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
              <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-sm sm:text-base font-semibold tracking-tight">
                New Conversation
              </DialogTitle>
              {/* FIX 5: Hide subtitle on very small screens to save vertical space */}
              <p className="hidden sm:block text-[11px] text-muted-foreground">
                Search by name or email address
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Search Input — fixed, never scrolls */}
        <div className="border-b border-border px-3 py-2.5 sm:px-4 sm:py-3 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 rounded-xl bg-input px-3 py-2 sm:px-3.5 sm:py-2.5 ring-1 ring-border/50 transition-all duration-200 focus-within:ring-primary/50">
            {isSearching ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
            ) : (
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter email or name..."
              autoFocus
              className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {/* FIX 6: Hide Esc kbd hint on mobile — irrelevant for touch */}
            <kbd className="hidden sm:inline-block rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              Esc
            </kbd>
          </div>
        </div>

        {/* 
          FIX 7: Results area is the ONLY scrollable region.
          flex-1 + overflow-y-auto means it expands to fill available modal height
          and scrolls internally — header/footer never get pushed off screen.
        */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {!searchQuery.trim() ? (
            <div className="flex flex-col items-center justify-center px-6 py-8 sm:py-10 text-center">
              <div className="mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-secondary">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Find someone to chat with
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Start typing to search users by name or email
              </p>
            </div>
          ) : isSearching ? (
            <div className="flex items-center justify-center py-8 sm:py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-8 sm:py-10 text-center">
              <div className="mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-secondary">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
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
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 hover:bg-secondary active:bg-secondary"
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-9 w-9 sm:h-10 sm:w-10 ring-2 ring-transparent transition-all duration-200 group-hover:ring-primary/20">
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
                    {/* FIX 8: Always show action icon on touch, hover-only on desktop */}
                    <div className="shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:opacity-0">
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

        {/* Footer — fixed, never scrolls */}
        {/* FIX 9: Hide footer on mobile to reclaim vertical space */}
        <div className="hidden sm:block border-t border-border bg-secondary/30 px-4 py-2.5 shrink-0">
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
"use client"

import { useState, useRef, useCallback, useEffect, memo } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Reply,
  Copy,
  Info,
  Undo2,
  Trash2,
  MoreVertical,
  Edit3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message } from "../containers/ChatContainer"

interface MessageContextMenuProps {
  message: Message
  children: React.ReactNode
  onReply?: (message: Message) => void
  onCopy?: (content: string) => void
  onInfo?: (messageId: string) => void
  onUnsend?: (messageId: string) => void
  onDelete?: (messageId: string) => void
  onEdit?: (messageId: string) => void
}

export const MessageContextMenu = memo(({
  message,
  children,
  onReply,
  onCopy,
  onInfo,
  onUnsend,
  onDelete,
  onEdit,
}: MessageContextMenuProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const touchStartPos = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartPos.current = { x: touch.clientX, y: touch.clientY }

    longPressTimer.current = setTimeout(() => {
      setIsMobileMenuOpen(true)
    }, 400)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartPos.current) return
    const touch = e.touches[0]
    const dx = Math.abs(touch.clientX - touchStartPos.current.x)
    const dy = Math.abs(touch.clientY - touchStartPos.current.y)

    // Cancel long press if user scrolls
    if (dx > 10 || dy > 10) {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    touchStartPos.current = null
  }, [])

  // Don't show context menu for unsent messages
  if (message.isUnsent) {
    return <>{children}</>
  }

  // Edit is only available within 15 minutes of sending
  const EDIT_WINDOW_MS = 15 * 60 * 1000;
  const isWithin15Min = Date.now() - new Date(message.createdAt).getTime() < EDIT_WINDOW_MS;

  const actions = message.isSent
    ? [
        ...(isWithin15Min
          ? [{ key: "edit", label: "Edit", icon: Edit3, onClick: () => onEdit?.(message.id) }]
          : []),
        { key: "reply", label: "Reply", icon: Reply, onClick: () => onReply?.(message) },
        { key: "copy", label: "Copy", icon: Copy, onClick: () => onCopy?.(message.content) },
        { key: "info", label: "Info", icon: Info, onClick: () => onInfo?.(message.id) },
        { key: "unsend", label: "Unsend", icon: Undo2, onClick: () => onUnsend?.(message.id), destructive: true },
        { key: "delete", label: "Delete", icon: Trash2, onClick: () => onDelete?.(message.id), destructive: true },
      ]
    : [
        { key: "reply", label: "Reply", icon: Reply, onClick: () => onReply?.(message) },
        { key: "copy", label: "Copy", icon: Copy, onClick: () => onCopy?.(message.content) },
        { key: "info", label: "Info", icon: Info, onClick: () => onInfo?.(message.id) },
        { key: "delete", label: "Delete", icon: Trash2, onClick: () => onDelete?.(message.id), destructive: true },
      ]

  return (
    <>
      {/* Message wrapper with hover detection */}
      <div
        className="group relative inline-block max-w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {children}

        {/* Desktop: 3-dot trigger on hover */}
        <div
          className={cn(
            "absolute top-0 z-30 transition-all duration-200",
            message.isSent ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2",
            (isHovered || isMenuOpen) 
              ? "opacity-100 scale-100 pointer-events-auto" 
              : "opacity-0 scale-75 pointer-events-none",
            "hidden md:block"
          )}
        >
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full",
                "bg-card/95 backdrop-blur-md shadow-lg ring-1 ring-border/50",
                "text-muted-foreground hover:text-foreground hover:bg-accent",
                "transition-all duration-200 hover:shadow-xl hover:scale-110",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer",
                isMenuOpen && "bg-accent text-foreground ring-border scale-110"
              )}
            >
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={message.isSent ? "start" : "end"}
              side="bottom"
              sideOffset={4}
              className="w-40 rounded-xl border-border/50 bg-card/95 backdrop-blur-md shadow-xl animate-in fade-in-0 zoom-in-95 duration-150"
            >
              {actions.map((action) => (
                <DropdownMenuItem
                  key={action.key}
                  onClick={action.onClick}
                  className={cn(
                    "cursor-pointer gap-2.5 rounded-lg text-[13px] font-medium transition-colors",
                    action.destructive
                      ? "text-destructive focus:text-destructive focus:bg-destructive/10"
                      : "text-foreground focus:bg-accent"
                  )}
                >
                  <action.icon className="h-4 w-4 shrink-0" />
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile: Bottom sheet overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden animate-in fade-in-0 duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

          {/* Bottom sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 animate-in slide-in-from-bottom-5 duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-3 mb-3 overflow-hidden rounded-2xl bg-card border border-border/50 shadow-2xl">
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
              </div>

              {/* Message preview */}
              <div className="px-4 py-2 border-b border-border/30">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                  {message.isSent ? "Your message" : "Message"}
                </p>
                <p className="text-sm text-foreground line-clamp-2 mt-0.5">
                  {message.content}
                </p>
              </div>

              {/* Actions */}
              <div className="py-1.5">
                {actions.map((action) => (
                  <button
                    key={action.key}
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      action.onClick()
                    }}
                    className={cn(
                      "flex w-full items-center gap-3.5 px-4 py-3 text-left transition-colors active:bg-accent/50",
                      action.destructive
                        ? "text-destructive"
                        : "text-foreground"
                    )}
                  >
                    <action.icon className="h-[18px] w-[18px] shrink-0" />
                    <span className="text-[15px] font-medium">{action.label}</span>
                  </button>
                ))}
              </div>

              {/* Cancel */}
              <div className="border-t border-border/30 p-1.5">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl py-3 text-[15px] font-semibold text-muted-foreground transition-colors active:bg-accent/50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

MessageContextMenu.displayName = "MessageContextMenu"

"use client"

import { memo } from "react"
import { X, Reply } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message } from "../containers/ChatContainer"

interface ReplyPreviewBarProps {
  message: Message
  onCancel: () => void
}

export const ReplyPreviewBar = memo(({ message, onCancel }: ReplyPreviewBarProps) => {
  return (
    <div className="flex items-center gap-2 px-3 py-2 animate-in slide-in-from-bottom-2 duration-200 ease-out">
      <div
        className={cn(
          "flex flex-1 items-center gap-3 rounded-xl px-3 py-2.5",
          "bg-secondary/80 ring-1 ring-border/40",
          "border-l-[3px] border-l-primary"
        )}
      >
        <Reply className="h-4 w-4 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-primary leading-none">
            {message.isSent ? "Replying to yourself" : "Replying"}
          </p>
          <p className="mt-0.5 text-[13px] text-muted-foreground truncate leading-snug">
            {message.content}
          </p>
        </div>
        <button
          onClick={onCancel}
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
            "text-muted-foreground hover:text-foreground hover:bg-accent",
            "transition-all duration-150"
          )}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
})

ReplyPreviewBar.displayName = "ReplyPreviewBar"

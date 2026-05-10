"use client"

import { useState, useEffect, memo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Clock,
  CheckCheck,
  Check,
  Send,
  User,
  Undo2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import * as messageService from "../services/message.service"

interface MessageInfoModalProps {
  messageId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const MessageInfoModal = memo(({ messageId, open, onOpenChange }: MessageInfoModalProps) => {
  const [info, setInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && messageId) {
      setLoading(true)
      messageService.getMessageInfo(messageId)
        .then((res: any) => {
          const data = res?.data || res
          setInfo(data)
        })
        .catch((err) => {
          console.error("Failed to fetch message info:", err)
        })
        .finally(() => setLoading(false))
    } else {
      setInfo(null)
    }
  }, [open, messageId])

  const formatDateTime = (date: string | Date | undefined) => {
    if (!date) return "—"
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl border-border/50 bg-card/95 backdrop-blur-md shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-foreground">
            Message Info
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
              <Clock className="h-4 w-4 animate-spin" />
              <span>Loading info...</span>
            </div>
          </div>
        ) : info ? (
          <div className="space-y-4">
            {/* Message preview */}
            <div className="rounded-xl bg-secondary/60 p-3.5 ring-1 ring-border/30">
              {info.isUnsent ? (
                <p className="text-sm italic text-muted-foreground">
                  This message was unsent
                </p>
              ) : (
                <p className="text-sm text-foreground leading-relaxed line-clamp-4">
                  {info.content}
                </p>
              )}
            </div>

            {/* Info rows */}
            <div className="space-y-0.5">
              {/* Sender */}
              {info.senderId && typeof info.senderId === "object" && (
                <InfoRow
                  icon={User}
                  label="From"
                  value={info.senderId.name || info.senderId.email || "Unknown"}
                />
              )}

              {/* Sent */}
              <InfoRow
                icon={Send}
                label="Sent"
                value={formatDateTime(info.createdAt)}
                iconClass="text-primary"
              />

              {/* Status */}
              <InfoRow
                icon={info.status === "read" ? CheckCheck : Check}
                label="Status"
                value={
                  info.isUnsent
                    ? "Unsent"
                    : info.status === "read"
                    ? "Read"
                    : info.status === "delivered"
                    ? "Delivered"
                    : "Sent"
                }
                iconClass={
                  info.isUnsent
                    ? "text-muted-foreground"
                    : info.status === "read"
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              />

              {/* Unsent indicator */}
              {info.isUnsent && (
                <InfoRow
                  icon={Undo2}
                  label="Unsent at"
                  value={formatDateTime(info.updatedAt)}
                  iconClass="text-destructive"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">No info available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
})

MessageInfoModal.displayName = "MessageInfoModal"

// ── Helper component ────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
  iconClass,
}: {
  icon: any
  label: string
  value: string
  iconClass?: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/30">
      <Icon className={cn("h-4 w-4 shrink-0", iconClass || "text-muted-foreground")} />
      <span className="text-[13px] text-muted-foreground min-w-[60px]">{label}</span>
      <span className="text-[13px] font-medium text-foreground">{value}</span>
    </div>
  )
}

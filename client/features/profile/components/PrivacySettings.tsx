"use client"

import { Shield, Check, ShieldBan, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SettingsState } from "../types"
import { useEffect, useState } from "react"
import * as profileService from "../services/profile.service"

interface PrivacySettingsProps {
  settings: SettingsState
  setSettings: (settings: SettingsState) => void
}

export function PrivacySettings({ settings, setSettings }: PrivacySettingsProps) {
  const [blockedUsers, setBlockedUsers] = useState<any[]>([])
  const [isLoadingBlocked, setIsLoadingBlocked] = useState(false)
  const [unblockingId, setUnblockingId] = useState<string | null>(null)

  const updateSetting = (key: keyof SettingsState, value: any) => {
    setSettings({ ...settings, [key]: value })
  }

  useEffect(() => {
    const fetchBlocked = async () => {
      setIsLoadingBlocked(true)
      try {
        const res: any = await profileService.getBlockedUsers()
        setBlockedUsers(Array.isArray(res) ? res : [])
      } catch (error) {
        console.error("Failed to fetch blocked users:", error)
      } finally {
        setIsLoadingBlocked(false)
      }
    }
    fetchBlocked()
  }, [])

  const handleUnblock = async (targetId: string) => {
    setUnblockingId(targetId)
    try {
      await profileService.unblockUser(targetId)
      setBlockedUsers((prev) => prev.filter((u) => u._id !== targetId))
    } catch (error) {
      console.error("Failed to unblock user:", error)
    } finally {
      setUnblockingId(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
            <Shield className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Show online status</p>
            <p className="text-xs text-muted-foreground">Let others see when you&apos;re online</p>
          </div>
        </div>
        <Switch
          checked={settings.showOnlineStatus}
          onCheckedChange={(checked) => updateSetting("showOnlineStatus", checked)}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
            <Check className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Read receipts</p>
            <p className="text-xs text-muted-foreground">Show when you&apos;ve read messages</p>
          </div>
        </div>
        <Switch
          checked={settings.readReceipts}
          onCheckedChange={(checked) => updateSetting("readReceipts", checked)}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      {/* Blocked Users Section */}
      <div className="border-t border-border pt-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
            <ShieldBan className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Blocked users</p>
            <p className="text-xs text-muted-foreground">
              Blocked users can&apos;t send you messages
            </p>
          </div>
        </div>

        {isLoadingBlocked ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : blockedUsers.length === 0 ? (
          <div className="rounded-xl bg-secondary/50 border border-border px-4 py-5 text-center">
            <p className="text-sm text-muted-foreground">No blocked users</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Users you block will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {blockedUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-secondary/50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-9 w-9 ring-2 ring-border shrink-0">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-secondary text-xs font-medium text-foreground">
                      {user.name?.slice(0, 2)?.toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {user.name}
                    </p>
                    {user.username && (
                      <p className="truncate text-xs text-muted-foreground">
                        @{user.username}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => handleUnblock(user._id)}
                  disabled={unblockingId === user._id}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-xs font-medium text-primary hover:bg-primary/10 hover:text-primary shrink-0 transition-all duration-200"
                >
                  {unblockingId === user._id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Unblock"
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

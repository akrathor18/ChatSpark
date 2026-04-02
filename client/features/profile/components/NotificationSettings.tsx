"use client"

import { Bell, Mail, Volume2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { SettingsState } from "../types"

interface NotificationSettingsProps {
  settings: SettingsState
  setSettings: (settings: SettingsState) => void
}

export function NotificationSettings({ settings, setSettings }: NotificationSettingsProps) {
  const updateSetting = (key: keyof SettingsState, value: any) => {
    setSettings({ ...settings, [key]: value })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
            <Bell className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Push notifications</p>
            <p className="text-xs text-muted-foreground">Receive message alerts on your device</p>
          </div>
        </div>
        <Switch
          checked={settings.notifications}
          onCheckedChange={(checked) => updateSetting("notifications", checked)}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
            <Mail className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Email notifications</p>
            <p className="text-xs text-muted-foreground">Receive updates via email</p>
          </div>
        </div>
        <Switch
          checked={settings.emailNotifications}
          onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
          className="data-[state=checked]:bg-primary"
        />
      </div>
    </div>
  )
}

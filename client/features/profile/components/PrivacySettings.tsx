"use client"

import { Shield, Check } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { SettingsState } from "../types"

interface PrivacySettingsProps {
  settings: SettingsState
  setSettings: (settings: SettingsState) => void
}

export function PrivacySettings({ settings, setSettings }: PrivacySettingsProps) {
  const updateSetting = (key: keyof SettingsState, value: any) => {
    setSettings({ ...settings, [key]: value })
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
    </div>
  )
}

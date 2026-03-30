"use client"

import { Moon } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { SettingsState } from "../types"

interface AppearanceSettingsProps {
  settings: SettingsState
  setSettings: (settings: SettingsState) => void
}

export function AppearanceSettings({ settings, setSettings }: AppearanceSettingsProps) {
  const updateSetting = (key: keyof SettingsState, value: any) => {
    setSettings({ ...settings, [key]: value })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
            <Moon className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Dark mode</p>
            <p className="text-xs text-muted-foreground">Use dark theme throughout the app</p>
          </div>
        </div>
        <Switch
          checked={settings.darkMode}
          onCheckedChange={(checked) => updateSetting("darkMode", checked)}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      {/* Theme preview */}
      <div className="rounded-xl border border-border bg-secondary/30 p-4">
        <p className="mb-3 text-xs font-medium text-muted-foreground">Theme Preview</p>
        <div className="flex gap-3">
          <div className="flex-1 rounded-lg bg-message-sent p-3">
            <p className="text-xs text-message-sent-foreground">Sent message</p>
          </div>
          <div className="flex-1 rounded-lg bg-message-received p-3">
            <p className="text-xs text-message-received-foreground">Received</p>
          </div>
        </div>
      </div>
    </div>
  )
}

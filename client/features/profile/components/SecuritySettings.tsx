"use client"

import { Lock, LogOut, Trash2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { SettingsState } from "../types"

interface SecuritySettingsProps {
  settings: SettingsState
  setSettings: (settings: SettingsState) => void
  onSignOut: () => void
  onDeleteAccount: () => void
}

export function SecuritySettings({ settings, setSettings, onSignOut, onDeleteAccount }: SecuritySettingsProps) {
  const updateSetting = (key: keyof SettingsState, value: any) => {
    setSettings({ ...settings, [key]: value })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
            <Lock className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
            <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
          </div>
        </div>
        <Switch
          checked={settings.twoFactorAuth}
          onCheckedChange={(checked) => updateSetting("twoFactorAuth", checked)}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      <Button
        variant="outline"
        className="w-full h-10 gap-2 rounded-xl border-border text-foreground transition-all duration-200 hover:bg-secondary"
      >
        <Lock className="h-4 w-4" />
        Change password
      </Button>

      {/* Danger zone */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-destructive">
          Danger Zone
        </h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={onSignOut}
            className="h-10 flex-1 gap-2 rounded-xl border-border text-foreground transition-all duration-200 hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onDeleteAccount}
            className="h-10 flex-1 gap-2 rounded-xl border-destructive/50 text-destructive transition-all duration-200 hover:bg-destructive/10 hover:border-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Delete account
          </Button>
        </div>
      </div>
    </div>
  )
}

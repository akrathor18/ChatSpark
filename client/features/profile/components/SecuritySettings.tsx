"use client"

import { useState, useRef, useEffect } from "react"
import { Lock, LogOut, Trash2, Eye, EyeOff, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SettingsState } from "../types"

interface SecuritySettingsProps {
  settings: SettingsState
  onSignOut: () => void
  onDeleteAccount: () => void
  onPasswordSubmit: (data: any) => Promise<boolean>
  isLoading?: boolean
}

export function SecuritySettings({ 
  settings, 
  onSignOut, 
  onDeleteAccount, 
  onPasswordSubmit,
  isLoading 
}: SecuritySettingsProps) {
  const [isPasswordOpen, setIsPasswordOpen] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isPasswordOpen ? contentRef.current.scrollHeight : 0)
    }
  }, [isPasswordOpen, error, success])



  const handlePasswordSubmit = async () => {
    setError("")
    setSuccess("")
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.")
      return
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    
    const isSuccess = await onPasswordSubmit({ currentPassword, newPassword })
    if (isSuccess) {
      setSuccess("Password updated successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => {
          setIsPasswordOpen(false)
          setSuccess("")
      }, 2000)
    } else {
      setError("Failed to update password. Please check your current password.")
    }
  }

  const handleCancel = () => {
    setError("")
    setSuccess("")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setIsPasswordOpen(false)
  }

  return (
    <div className="space-y-5">
      {/* Change Password Toggle Button */}
      <Button
        variant="outline"
        disabled={isLoading}
        onClick={() => setIsPasswordOpen((prev) => !prev)}
        className="w-full h-10 gap-2 rounded-xl border-border text-foreground transition-all duration-200 hover:bg-secondary"
      >
        <Lock className="h-4 w-4" />
        Change password
        <ChevronDown
          className="ml-auto h-4 w-4 transition-transform duration-300"
          style={{ transform: isPasswordOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </Button>

      {/* Animated Dropdown */}
      <div
        style={{
          height: contentHeight,
          overflow: "hidden",
          transition: "height 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div ref={contentRef}>
          <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Current password</Label>
              <div className="relative">
                <Input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter current password"
                  className="h-9 rounded-lg border-border bg-background pr-9 text-sm placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showCurrent ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">New password</Label>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter new password"
                  className="h-9 rounded-lg border-border bg-background pr-9 text-sm placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Confirm new password</Label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Confirm new password"
                  className="h-9 rounded-lg border-border bg-background pr-9 text-sm placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
            
            {/* Success message */}
            {success && (
              <p className="text-xs text-green-500">{success}</p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={handleCancel}
                className="h-9 flex-1 rounded-xl border-border text-foreground text-sm transition-all duration-200 hover:bg-secondary"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handlePasswordSubmit}
                disabled={isLoading}
                className="h-9 flex-1 rounded-xl text-sm transition-all duration-200"
              >
                {isLoading ? "Updating..." : "Update password"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-destructive">
          Danger Zone
        </h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={onSignOut}
            className="h-10 flex-1 gap-2 rounded-xl border-border text-foreground transition-all duration-200 hover:bg-secondary"
          >
            <Lock className="h-4 w-4" />
            Sign out
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
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
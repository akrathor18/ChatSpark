"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AtSign,
  Loader2,
  Check,
  X,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/useAuthStore"
import { redirect } from 'next/navigation';
import { useUserStore } from "@/store/useUserStore"
// Simulated taken usernames for demo
const TAKEN_USERNAMES = ["john", "admin", "chatspark", "user", "test", "demo"]

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid"

export default function OnboardingPage() {
  const { user } = useUserStore()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [status, setStatus] = useState<UsernameStatus>("idle")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState(false)
  console.log("user", user)
  if (!user) {
    redirect("/sign-up");
  }

  if (user.username) {
    redirect("/chat");
  }
  // Validation rules
  const validationRules = {
    minLength: username.length >= 3,
    maxLength: username.length <= 20,
    validChars: /^[a-zA-Z0-9_]*$/.test(username),
    startsWithLetter: /^[a-zA-Z]/.test(username),
  }

  const isValidFormat =
    validationRules.minLength &&
    validationRules.maxLength &&
    validationRules.validChars &&
    validationRules.startsWithLetter

  // Debounced username check
  const checkUsername = useCallback(async (value: string) => {
    if (!value || value.length < 3) {
      setStatus("idle")
      return
    }

    // Check format first
    if (!(/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value))) {
      setStatus("invalid")
      return
    }

    setStatus("checking")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (TAKEN_USERNAMES.includes(value.toLowerCase())) {
      setStatus("taken")
    } else {
      setStatus("available")
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (username && touched) {
        checkUsername(username)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [username, touched, checkUsername])

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")
    setUsername(value)
    if (!touched) setTouched(true)
    if (status !== "idle" && status !== "checking") {
      setStatus("idle")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (status !== "available") return

    setIsSubmitting(true)

    // Simulate saving username
    await new Promise((resolve) => setTimeout(resolve, 1500))

    router.push("/chat")
  }

  const getStatusMessage = () => {
    switch (status) {
      case "checking":
        return { text: "Checking availability...", color: "text-muted-foreground" }
      case "available":
        return { text: "Username is available!", color: "text-online" }
      case "taken":
        return { text: "This username is already taken", color: "text-destructive" }
      case "invalid":
        return { text: "Invalid username format", color: "text-destructive" }
      default:
        return null
    }
  }

  const statusMessage = getStatusMessage()

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/5 md:p-8">
        {/* Header with icon */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <AtSign className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Choose your username
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This is how others will find and mention you on ChatSpark
          </p>
        </div>

        {/* Username Preview */}
        <div className="mb-6 rounded-xl bg-secondary/50 p-4 ring-1 ring-border/60">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Your profile URL
          </p>
          <p className="mt-1.5 truncate font-mono text-sm text-foreground">
            chatspark.app/
            <span className={cn(
              "transition-colors",
              username ? "text-primary" : "text-muted-foreground"
            )}>
              {username || "username"}
            </span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-foreground">
              Username
            </Label>
            <div className="relative">
              <AtSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="cooldev"
                value={username}
                onChange={handleUsernameChange}
                maxLength={20}
                autoComplete="off"
                autoFocus
                className={cn(
                  "h-12 rounded-xl border-border bg-input pl-10 pr-10 text-foreground placeholder:text-muted-foreground transition-colors",
                  status === "available" && "border-online focus:border-online focus:ring-online",
                  status === "taken" && "border-destructive focus:border-destructive focus:ring-destructive",
                  status === "invalid" && "border-destructive focus:border-destructive focus:ring-destructive"
                )}
              />
              {/* Status icon */}
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {status === "checking" && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {status === "available" && (
                  <CheckCircle2 className="h-4 w-4 text-online" />
                )}
                {(status === "taken" || status === "invalid") && (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
              </div>
            </div>

            {/* Status message */}
            {statusMessage && (
              <p className={cn("flex items-center gap-1.5 text-xs", statusMessage.color)}>
                {status === "checking" && <Loader2 className="h-3 w-3 animate-spin" />}
                {status === "available" && <Check className="h-3 w-3" />}
                {(status === "taken" || status === "invalid") && <X className="h-3 w-3" />}
                {statusMessage.text}
              </p>
            )}

            {/* Character count */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {username.length}/20 characters
              </p>
            </div>
          </div>

          {/* Validation checklist */}
          {touched && username.length > 0 && (
            <div className="rounded-xl bg-secondary/30 p-4 ring-1 ring-border/40">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Username requirements
              </p>
              <div className="grid gap-2">
                {[
                  { check: validationRules.startsWithLetter, label: "Starts with a letter" },
                  { check: validationRules.minLength, label: "At least 3 characters" },
                  { check: validationRules.maxLength, label: "Maximum 20 characters" },
                  { check: validationRules.validChars, label: "Only letters, numbers, and underscores" },
                ].map(({ check, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs">
                    <div className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full transition-colors",
                      check ? "bg-online/20" : "bg-secondary"
                    )}>
                      {check ? (
                        <Check className="h-2.5 w-2.5 text-online" />
                      ) : (
                        <X className="h-2.5 w-2.5 text-muted-foreground" />
                      )}
                    </div>
                    <span className={cn(
                      "transition-colors",
                      check ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions when taken */}
          {status === "taken" && (
            <div className="rounded-xl bg-secondary/30 p-4 ring-1 ring-border/40">
              <p className="mb-3 text-xs font-medium text-muted-foreground">
                Try one of these instead:
              </p>
              <div className="flex flex-wrap gap-2">
                {[`${username}123`, `${username}_dev`, `the_${username}`, `${username}99`].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setUsername(suggestion)
                      setStatus("idle")
                    }}
                    className="rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:border-primary/40 hover:bg-secondary"
                  >
                    @{suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={status !== "available" || isSubmitting}
            className="h-12 w-full rounded-xl bg-primary font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-primary/30 disabled:opacity-50 disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving username...
              </>
            ) : (
              <>
                Continue to ChatSpark
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Skip option */}
        <p className="mt-5 text-center text-xs text-muted-foreground">
          You can always change your username later in{" "}
          <span className="text-foreground">Settings</span>
        </p>
      </div>

      {/* Decorative elements */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span>One last step before you start chatting</span>
      </div>
    </div>
  )
}

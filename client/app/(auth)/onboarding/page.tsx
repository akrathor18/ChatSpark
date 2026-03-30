"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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
  CheckCircle2,
  Camera,
  ImagePlus,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/useAuthStore"
import { redirect } from 'next/navigation';
import { useUserStore } from "@/store/useUserStore"

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid"

export default function OnboardingPage() {
  const {
    user,
    checkUsername: checkUsernameStore,
    updateUsername,
    uploadProfilePic,
    isCheckingUsername,
    isUploadingAvatar,
    usernameAvailable,
  } = useUserStore()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState(false)

  // Avatar states
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [avatarUploaded, setAvatarUploaded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!user) {
    redirect("/sign-up");
  }

  if (user.username) {
    redirect("/chat");
  }

  // Set initial avatar from user if exists (e.g. OAuth avatar)
  useEffect(() => {
    if (user?.avatar && !avatarPreview) {
      setAvatarPreview(user.avatar)
      setAvatarUploaded(true)
    }
  }, [user?.avatar, avatarPreview])

  // --- Avatar handling ---
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Please upload a JPG, PNG, WebP, or GIF image"
    }
    if (file.size > MAX_FILE_SIZE) {
      return "Image must be less than 5MB"
    }
    return null
  }

  const handleFileSelect = (file: File) => {
    const error = validateFile(file)
    if (error) {
      setAvatarError(error)
      return
    }

    setAvatarError(null)
    setAvatarFile(file)
    setAvatarUploaded(false)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }

  const removeAvatar = () => {
    setAvatarPreview(null)
    setAvatarFile(null)
    setAvatarError(null)
    setAvatarUploaded(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // --- Username handling ---
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

  const status: UsernameStatus = isCheckingUsername
    ? "checking"
    : !username || !touched || username === user?.username
      ? "idle"
      : !isValidFormat
        ? "invalid"
        : usernameAvailable === true
          ? "available"
          : usernameAvailable === false
            ? "taken"
            : "idle"

  const checkUsername = useCallback(async (value: string) => {
    if (!value || value.length < 3) return
    if (!(/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value))) return
    checkUsernameStore(value)
  }, [checkUsernameStore])

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
  }

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status !== "available") return

    setIsSubmitting(true)

    try {
      // Upload avatar if a new file is selected and not yet uploaded
      if (avatarFile && !avatarUploaded) {
        const uploadSuccess = await uploadProfilePic(avatarFile)
        if (!uploadSuccess) {
          setAvatarError("Failed to upload profile picture. Please try again.")
          setIsSubmitting(false)
          return
        }
        setAvatarUploaded(true)
      }

      // Update username
      const success = await updateUsername(username)
      if (success) {
        router.push("/chat")
      }
    } catch (error) {
      console.error("Failed to complete onboarding:", error)
    } finally {
      setIsSubmitting(false)
    }
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
  const isFormBusy = isSubmitting || isUploadingAvatar

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/5 md:p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Set up your profile
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add a photo and choose your username to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileInputChange}
              className="hidden"
              id="avatar-upload"
            />

            <div
              className={cn(
                "group relative cursor-pointer rounded-full transition-all duration-300",
                isDragging && "scale-105"
              )}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Avatar circle */}
              <div
                className={cn(
                  "flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-all duration-300",
                  avatarPreview
                    ? "border-transparent"
                    : isDragging
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary/50 hover:border-primary/50 hover:bg-secondary",
                  isUploadingAvatar && "opacity-60"
                )}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus className={cn(
                    "h-8 w-8 transition-colors",
                    isDragging ? "text-primary" : "text-muted-foreground"
                  )} />
                )}
              </div>

              {/* Camera overlay on hover */}
              {!isUploadingAvatar && (
                <div className={cn(
                  "absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-200",
                  avatarPreview ? "group-hover:opacity-100" : "group-hover:opacity-0"
                )}>
                  <Camera className="h-6 w-6 text-white" />
                </div>
              )}

              {/* Upload spinner overlay */}
              {isUploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}

              {/* Upload success badge */}
              {avatarUploaded && avatarPreview && !isUploadingAvatar && (
                <div className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-online ring-2 ring-card">
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </div>

            {/* Helper text & remove button */}
            <div className="flex flex-col items-center gap-1.5">
              {avatarPreview && !isUploadingAvatar ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeAvatar()
                  }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove photo
                </button>
              ) : !isUploadingAvatar ? (
                <p className="text-xs text-muted-foreground">
                  Click or drag to upload · JPG, PNG, WebP, GIF · Max 5MB
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Uploading...
                </p>
              )}
            </div>

            {/* Avatar error */}
            {avatarError && (
              <p className="flex items-center gap-1.5 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {avatarError}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
          </div>

          {/* Username Preview */}
          <div className="rounded-xl bg-secondary/50 p-4 ring-1 ring-border/60">
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

          {/* Username Input */}
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
            disabled={status !== "available" || isFormBusy}
            className="h-12 w-full rounded-xl bg-primary font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-primary/30 disabled:opacity-50 disabled:shadow-none"
          >
            {isFormBusy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploadingAvatar ? "Uploading photo..." : "Saving username..."}
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
          Profile photo is optional. You can always add it later in{" "}
          <span className="text-foreground">Settings</span>
        </p>
      </div>

      {/* Decorative */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span>One last step before you start chatting</span>
      </div>
    </div>
  )
}

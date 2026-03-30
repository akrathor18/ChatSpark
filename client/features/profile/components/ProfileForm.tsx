"use client"

import { FieldErrors, UseFormRegister } from "react-hook-form"
import { User, AtSign, Mail, Loader2, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ProfileFormData } from "../types"

interface ProfileFormProps {
  register: UseFormRegister<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
  watchedUsername: string
  initialUsername?: string
  usernameAvailable?: boolean | null
  isCheckingUsername: boolean
}

export function ProfileForm({
  register,
  errors,
  watchedUsername,
  initialUsername,
  usernameAvailable,
  isCheckingUsername,
}: ProfileFormProps) {
  const isUsernameChanged = watchedUsername !== initialUsername

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-foreground">
          Full name
        </Label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="name"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
            })}
            className={cn(
              "h-11 rounded-xl border-border bg-input pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary",
              errors.name && "border-destructive focus:border-destructive focus:ring-destructive"
            )}
          />
        </div>
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium text-foreground">
          Username
        </Label>
        <div className="relative">
          <AtSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="username"
            {...register("username", {
              required: "Username is required",
              pattern: { value: /^[a-zA-Z0-9_]+$/, message: "Only letters, numbers, and underscores" },
              validate: (value) => {
                if (value !== initialUsername && usernameAvailable === false) {
                  return "Username is already taken"
                }
                return true
              }
            })}
            className={cn(
              "h-11 rounded-xl border-border bg-input pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary",
              errors.username && "border-destructive focus:border-destructive focus:ring-destructive",
              isUsernameChanged && usernameAvailable === true && "border-online focus:border-online focus:ring-online"
            )}
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
            {isCheckingUsername ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : isUsernameChanged && watchedUsername.length > 0 ? (
              usernameAvailable === true ? (
                <Check className="h-4 w-4 text-online" />
              ) : usernameAvailable === false ? (
                <X className="h-4 w-4 text-destructive" />
              ) : null
            ) : null}
          </div>
        </div>
        {errors.username && (
          <p className="text-xs text-destructive">{errors.username.message as string}</p>
        )}
        {isUsernameChanged && usernameAvailable === true && !errors.username && (
          <p className="text-xs text-online">Username is available</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
            })}
            className={cn(
              "h-11 rounded-xl border-border bg-input pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary",
              errors.email && "border-destructive focus:border-destructive focus:ring-destructive"
            )}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-sm font-medium text-foreground">
          Bio
        </Label>
        <textarea
          id="bio"
          {...register("bio", { maxLength: { value: 200, message: "Bio must be 200 characters or less" } })}
          rows={3}
          className={cn(
            "w-full resize-none rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
            errors.bio && "border-destructive focus:border-destructive focus:ring-destructive"
          )}
          placeholder="Tell us about yourself..."
        />
        {errors.bio && (
          <p className="text-xs text-destructive">{errors.bio.message as string}</p>
        )}
      </div>
    </form>
  )
}

"use client"

import { RefObject } from "react"
import { Camera, ImagePlus, Loader2, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AvatarUploadProps {
  fileInputRef: RefObject<HTMLInputElement | null>
  avatarPreview: string | null
  isUploadingAvatar: boolean
  isDraggingAvatar: boolean
  avatarError: string | null
  userName: string
  userUsername: string
  onFileSelect: (file: File) => void
  onRemove: () => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
}

export function AvatarUpload({
  fileInputRef,
  avatarPreview,
  isUploadingAvatar,
  isDraggingAvatar,
  avatarError,
  userName,
  userUsername,
  onFileSelect,
  onRemove,
  onDragOver,
  onDragLeave,
  onDrop,
}: AvatarUploadProps) {
  return (
    <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFileSelect(file)
        }}
        className="hidden"
        id="profile-avatar-upload"
      />
      <div
        className="group relative cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className={cn(
          "flex h-20 w-20 items-center justify-center overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-background transition-all duration-300 md:h-24 md:w-24",
          avatarPreview
            ? "ring-border"
            : isDraggingAvatar
              ? "ring-primary border-2 border-dashed border-primary bg-primary/10"
              : "ring-border border-2 border-dashed border-border bg-secondary/50 hover:border-primary/50",
          isUploadingAvatar && "opacity-60"
        )}>
          {avatarPreview ? (
            <img src={avatarPreview} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className={cn(
              "h-8 w-8 transition-colors",
              isDraggingAvatar ? "text-primary" : "text-muted-foreground"
            )} />
          )}
        </div>

        {/* Camera overlay on hover */}
        {!isUploadingAvatar && avatarPreview && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Camera className="h-6 w-6 text-white" />
          </div>
        )}

        {/* Upload spinner */}
        {isUploadingAvatar && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </div>

      <div className="text-center sm:text-left">
        <h3 className="text-lg font-semibold text-foreground">{userName || "User"}</h3>
        <p className="text-sm text-muted-foreground">@{userUsername || "username"}</p>
        <div className="mt-2 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploadingAvatar}
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
            className="h-8 gap-1.5 rounded-lg border-border text-xs transition-colors hover:bg-secondary"
          >
            {isUploadingAvatar ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading...</>
            ) : (
              <><Camera className="h-3.5 w-3.5" /> Change photo</>
            )}
          </Button>
          {avatarPreview && !isUploadingAvatar && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onRemove() }}
              className="h-8 gap-1.5 rounded-lg text-xs text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </Button>
          )}
        </div>
        {avatarError && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3 w-3" />
            {avatarError}
          </p>
        )}
        <p className="mt-1 text-[11px] text-muted-foreground">JPG, PNG, WebP, or GIF · Max 5MB</p>
      </div>
    </div>
  )
}

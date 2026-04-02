// components/profile/ProfileAvatar.tsx
// Responsible for: avatar with status ring and animated online dot

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { UserProfile } from "../services/profileService"

type Props = {
  user: UserProfile
  showOnlineStatus: boolean
}

export function ProfileAvatar({ user, showOnlineStatus }: Props) {
  const isOnline = user.isOnline

  return (
    <div className="relative shrink-0">
      {/* Ambient glow */}
      <div
        className={cn(
          "absolute inset-0 rounded-full blur-xl transition-opacity duration-300",
          isOnline && showOnlineStatus
            ? "bg-[var(--online)]/20 opacity-80"
            : "bg-primary/10 opacity-40"
        )}
      />

      <Avatar
        className={cn(
          "relative h-24 w-24 shadow-xl transition-all duration-300 md:h-28 md:w-28",
          isOnline && showOnlineStatus
            ? "ring-4 ring-[var(--online)]/60 ring-offset-2 ring-offset-card"
            : "ring-4 ring-primary/30 ring-offset-2 ring-offset-card"
        )}
      >
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="bg-secondary text-2xl font-bold text-foreground">
          {user.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Status dot */}
      {showOnlineStatus &&
        (isOnline ? (
          <span className="absolute bottom-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-card bg-[var(--online)] shadow-sm">
            <span className="h-2 w-2 animate-ping rounded-full bg-[var(--online)] opacity-75" />
          </span>
        ) : (
          <span className="absolute bottom-1.5 right-1.5 h-5 w-5 rounded-full border-[3px] border-card bg-muted shadow-sm" />
        ))}
    </div>
  )
}

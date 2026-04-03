// components/profile/ProfileCard.tsx
// Responsible for: the entire profile card (avatar, identity, bio, meta, CTA)

import { CheckCircle2, Clock, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { UserProfile } from "../services/profileService"
import { ProfileAvatar } from "./ProfileAvatar"
import { ProfileMeta } from "./ProfileMeta"
import { ActionButton } from "./ActionButton"

type Props = {
  user: UserProfile
  isOwnProfile: boolean
  isMessageLoading: boolean
  hasConversation: boolean
  showOnlineStatus: boolean
  onMessage: () => void
}

export function ProfileCard({
  user,
  isOwnProfile,
  isMessageLoading,
  hasConversation,
  showOnlineStatus,
  onMessage,
}: Props) {
  const isOnline = user?.isOnline || false

  const presenceNode = showOnlineStatus ? (
    isOnline ? (
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[var(--online)]" />
        <span className="text-xs font-medium text-[var(--online)]">Active now</span>
      </div>
    ) : user.privacySettings.showLastSeen && user.lastSeen ? (
      <div className="flex items-center gap-1.5">
        <Clock className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Last seen {user.lastSeen}</span>
      </div>
    ) : (
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
        <span className="text-xs text-muted-foreground">Offline</span>
      </div>
    )
  ) : (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Shield className="h-3 w-3" />
      Status hidden
    </div>
  )

  const actionBtn = (
    <ActionButton
      isOwnProfile={isOwnProfile}
      isMessageLoading={isMessageLoading}
      hasConversation={hasConversation}
      onMessage={onMessage}
    />
  )

  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-border bg-card p-5 shadow-xl transition-all duration-300",
        "hover:border-primary/25 hover:shadow-2xl hover:shadow-primary/10 md:p-7"
      )}
    >
      {/* Inner hover glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-primary/0 transition-all duration-300 group-hover:bg-primary/[0.02]" />

      {/* Avatar row */}
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <ProfileAvatar user={user} showOnlineStatus={showOnlineStatus} />

        {/* Identity */}
        <div className="flex flex-1 flex-col items-center sm:items-start">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              {user.name}
            </h1>
            {user.isVerified && (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
            )}
          </div>

          <p className="mt-0.5 text-sm text-muted-foreground">@{user.username}</p>

          <div className="mt-2.5">{presenceNode}</div>

          {/* CTA mobile */}
          <div className="mt-4 w-full sm:hidden">{actionBtn}</div>
        </div>

        {/* CTA desktop */}
        <div className="hidden shrink-0 sm:block">{actionBtn}</div>
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="mt-5 border-t border-border pt-5">
          <p className="text-sm leading-relaxed text-foreground/90">{user.bio}</p>
        </div>
      )}

      <ProfileMeta user={user} />
    </div>
  )
}

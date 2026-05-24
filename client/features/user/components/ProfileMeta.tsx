// components/profile/ProfileMeta.tsx
// Responsible for: website link + joined-date row

import { Link as LinkIcon, Calendar, ExternalLink } from "lucide-react"
import { UserProfile } from "../services/profileService"

type Props = {
  user: UserProfile
}

export function ProfileMeta({ user }: Props) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5 shrink-0" />
        <span>Joined {user.joinedDate}</span>
      </div>
    </div>
  )
}

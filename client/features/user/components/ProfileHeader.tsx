// components/profile/ProfileHeader.tsx
// Responsible for: the sticky top header (back, logo, copy, edit)

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowLeft, Copy, Check, Settings } from "lucide-react"

type Props = {
  isOwnProfile: boolean
  copied: boolean
  onBack: () => void
  onCopy: () => void
}

export function ProfileHeader({ isOwnProfile, copied, onBack, onCopy }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4 md:h-16 md:px-6">
        {/* Left: back + logo */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-9 w-9 rounded-xl text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Go back</span>
          </Button>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-sm shadow-primary/20">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">ChatSpark</span>
          </Link>
        </div>

        {/* Right: copy + (optional) edit */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCopy}
            title="Copy profile link"
            className="h-9 w-9 rounded-xl text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground active:scale-95"
          >
            {copied ? (
              <Check className="h-4 w-4 text-[var(--online)]" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy profile link</span>
          </Button>

          {isOwnProfile && (
            <Button
              asChild
              variant="outline"
              className="h-9 gap-2 rounded-xl border-border text-sm font-medium transition-all duration-200 hover:bg-secondary active:scale-[0.97]"
            >
              <Link href="/profile">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Edit Profile</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

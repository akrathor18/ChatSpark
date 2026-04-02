// components/profile/ProfileSkeleton.tsx
// Responsible for: full-page loading skeleton

import { Loader2, Sparkles } from "lucide-react"

export function ProfileSkeleton() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex h-14 items-center px-4 md:h-16 md:px-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-xl bg-secondary" />
            <div className="h-5 w-24 animate-pulse rounded-lg bg-secondary" />
          </div>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </main>
    </div>
  )
}

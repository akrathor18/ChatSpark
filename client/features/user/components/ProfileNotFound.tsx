// components/profile/ProfileNotFound.tsx
// Responsible for: 404 state when a username doesn't exist

import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sparkles, ArrowLeft, MessageSquare, UserX } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  username: string
  onBack: () => void
}

export function ProfileNotFound({ username, onBack }: Props) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex h-14 items-center px-4 md:h-16 md:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-9 w-9 rounded-xl text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-sm shadow-primary/20">
                <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">ChatSpark</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive/6 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-border bg-card shadow-xl">
            <UserX className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="mb-2 text-2xl font-semibold text-foreground">User not found</h1>
          <p className="text-sm text-muted-foreground">No one goes by</p>
          <code className="my-3 rounded-lg bg-secondary px-3 py-1.5 font-mono text-sm text-foreground">
            @{username}
          </code>
          <p className="mb-8 max-w-sm text-sm text-muted-foreground">
            The username may have changed or the link could be incorrect.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/chat"
              className={cn(
                buttonVariants({ variant: "default" }),
                "flex h-11 gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/30 active:scale-[0.97] justify-center items-center"
              )}
            >
              <MessageSquare className="h-4 w-4" />
              Go to Chat
            </Link>
            <Button
              variant="outline"
              onClick={onBack}
              className="h-11 gap-2 rounded-xl border-border px-6 text-sm font-medium text-foreground transition-all duration-200 hover:bg-secondary active:scale-[0.97]"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

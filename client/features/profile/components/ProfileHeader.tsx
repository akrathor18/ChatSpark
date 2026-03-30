"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Sparkles, Check, Loader2, Save, X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProfileHeaderProps {
  isSaving: boolean
  saved: boolean
  onSave: () => void
  mobileNavOpen: boolean
  onToggleMobileNav: () => void
}

export function ProfileHeader({ isSaving, saved, onSave, mobileNavOpen, onToggleMobileNav }: ProfileHeaderProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-30 flex-shrink-0 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4 md:h-16 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/chat")}
            className="h-9 w-9 rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to chat</span>
          </Button>
          <Link href="/chat" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-sm shadow-primary/20">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">Settings</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile nav toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMobileNav}
            className="h-9 w-9 rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
          >
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>

          <Button
            onClick={onSave}
            disabled={isSaving}
            className={cn(
              "h-9 gap-2 rounded-xl px-4 text-sm font-medium transition-all duration-200",
              saved
                ? "bg-online text-background"
                : "bg-primary text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary/90"
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </>
            ) : saved ? (
              <>
                <Check className="h-4 w-4" />
                <span className="hidden sm:inline">Saved</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save changes</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}

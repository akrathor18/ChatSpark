// components/profile/ShareCard.tsx
// Responsible for: the "Share profile" card below the main profile card

import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  username: string
  copied: boolean
  onCopy: () => void
}

export function ShareCard({ username, copied, onCopy }: Props) {
  return (
    <div className="mt-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            Share profile
          </p>
          <p className="mt-1 truncate font-mono text-sm text-foreground">
            chatspark.app/{username}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          className={cn(
            "h-9 gap-2 rounded-lg border-border text-xs transition-all duration-200 active:scale-95",
            copied
              ? "border-[var(--online)] bg-[var(--online)]/10 text-[var(--online)]"
              : "hover:border-primary/40 hover:bg-secondary"
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy Link
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

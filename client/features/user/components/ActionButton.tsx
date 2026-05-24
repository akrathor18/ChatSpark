// components/profile/ActionButton.tsx
// Responsible for: rendering the primary CTA (Edit / Continue Chat / Send Message)

import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { Settings, MessageSquare, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  isOwnProfile: boolean
  isMessageLoading: boolean
  hasConversation: boolean
  onMessage: () => void
}

export function ActionButton({
  isOwnProfile,
  isMessageLoading,
  hasConversation,
  onMessage,
}: Props) {
  const btnClass =
    "gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/35 active:scale-[0.97]"

  if (isOwnProfile) {
    return (
      <Link
        href="/profile"
        className={cn(
          buttonVariants({ variant: "default" }),
          btnClass,
          "flex justify-center items-center"
        )}
      >
        <Settings className="h-4 w-4" />
        Edit Profile
      </Link>
    )
  }

  return (
    <Button
      onClick={onMessage}
      disabled={isMessageLoading}
      className={`${btnClass} disabled:opacity-60`}
    >
      {isMessageLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Opening...
        </>
      ) : hasConversation ? (
        <>
          <MessageSquare className="h-4 w-4" />
          Continue Chat
        </>
      ) : (
        <>
          <MessageSquare className="h-4 w-4" />
          Send Message
        </>
      )}
    </Button>
  )
}

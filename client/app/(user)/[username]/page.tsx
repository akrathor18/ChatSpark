// app/[username]/page.tsx  ← Container
// Responsible for: ONLY wiring — no logic, no state, no JSX beyond layout shell.
// All behaviour lives in the hook; all UI lives in components.

"use client"

import { useParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { usePublicProfile } from "@/features/user/hooks/usePublicProfile"
import { ProfileSkeleton } from "@/features/user/components/ProfileSkeleton"
import { ProfileNotFound } from "@/features/user/components/ProfileNotFound"
import { ProfileHeader } from "@/features/user/components/ProfileHeader"
import { ProfileCard } from "@/features/user/components/ProfileCard"
import { ShareCard } from "@/features/user/components/ShareCard"
import { useProfile } from "@/features/profile/hooks/useProfile"

export default function PublicProfilePage() {
    const params = useParams()
    const router = useRouter()
    const username = params.username as string
    const { user: currentUser } = useProfile()

    const {
        user,
        isLoading,
        notFound,
        isMessageLoading,
        copied,
        mounted,
        isOwnProfile,
        hasConversation,
        showOnlineStatus,
        handleCopyLink,
        handleMessage,
    } = usePublicProfile(username, currentUser?.username || "")

    // ── Loading ──────────────────────────────────────────────────────────
    if (isLoading) return <ProfileSkeleton />

    // ── Not found ────────────────────────────────────────────────────────
    if (notFound) return <ProfileNotFound username={username} onBack={() => router.back()} />

    // ── Profile ──────────────────────────────────────────────────────────
    return (
        <div
            className={cn(
                "flex min-h-[100dvh] flex-col bg-background transition-all duration-500",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
        >
            <ProfileHeader
                isOwnProfile={isOwnProfile}
                copied={copied}
                onBack={() => router.back()}
                onCopy={handleCopyLink}
            />

            <main className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
                {/* Gradient banner */}
                <div className="relative h-36 md:h-44">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-primary/10 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
                        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />
                    </div>
                </div>

                {/* Cards */}
                <div className="relative mx-auto -mt-20 max-w-xl px-4 pb-12 md:-mt-24 md:px-6">
                    <ProfileCard
                        user={user!}
                        isOwnProfile={isOwnProfile}
                        isMessageLoading={isMessageLoading}
                        hasConversation={hasConversation}
                        showOnlineStatus={showOnlineStatus}
                        onMessage={handleMessage}
                    />
                    <ShareCard
                        username={username}
                        copied={copied}
                        onCopy={handleCopyLink}
                    />
                </div>
            </main>
        </div>
    )
}
import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { profileService } from "../services/profileService"
import { useProfileStore } from "../store/profileStore"

const COPY_RESET_MS = 2_000

export function usePublicProfile(username: string, currentUsername: string) {
  const router = useRouter()

  const {
    user,
    isLoading,
    notFound,
    isMessageLoading,
    copied,
    mounted,
    setUser,
    setLoading,
    setNotFound,
    setMessageLoading,
    setCopied,
    setMounted,
    reset,
  } = useProfileStore()

  // ── Fetch profile on mount / username change ───────────────────────────
  useEffect(() => {
    reset()

    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const profile = await profileService.getProfile(username)
        if (cancelled) return
        setUser(profile)
        setNotFound(false)
      } catch {
        if (cancelled) return
        setNotFound(true)
      } finally {
        if (!cancelled) {
          setLoading(false)
          // Trigger entry animation after paint
          requestAnimationFrame(() => setMounted(true))
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [username]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Copy profile link to clipboard ────────────────────────────────────
  const handleCopyLink = useCallback(async () => {
    const url = `${window.location.origin}/${username}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), COPY_RESET_MS)
  }, [username, setCopied])

  // ── Navigate to chat ───────────────────────────────────────────────────
  const handleMessage = useCallback(async () => {
    if (!user) return
    setMessageLoading(true)
    await new Promise((r) => setTimeout(r, 500)) // optimistic delay
    router.push(`/chat?user=${user._id}`)
  }, [user, router, setMessageLoading])

  // ── Derived values ─────────────────────────────────────────────────────
  const isOwnProfile = username === currentUsername
  const hasConversation = user ? profileService.hasExistingConversation(user._id) : false
  const showOnlineStatus = user?.privacySettings?.showOnlineStatus ?? false

  return {
    // State
    user,
    isLoading,
    notFound,
    isMessageLoading,
    copied,
    mounted,
    // Derived
    isOwnProfile,
    hasConversation,
    showOnlineStatus,
    // Actions
    handleCopyLink,
    handleMessage,
  }
}

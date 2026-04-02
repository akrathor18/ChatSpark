"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { User as UserIcon, Bell, Shield, Lock, Palette } from "lucide-react"

import { useProfile } from "../hooks/useProfile"
import { ProfileHeader } from "../components/ProfileHeader"
import { Sidebar, MobileSidebar } from "../components/Sidebar"
import { AvatarUpload } from "../components/AvatarUpload"
import { ProfileForm } from "../components/ProfileForm"
import { SettingsSection } from "../components/SettingsSection"
import { NotificationSettings } from "../components/NotificationSettings"
import { AppearanceSettings } from "../components/AppearanceSettings"
import { PrivacySettings } from "../components/PrivacySettings"
import { SecuritySettings } from "../components/SecuritySettings"
import { NavItem, ProfileFormData, SettingsState } from "../types"

import { useAuthStore } from "@/store/useAuthStore"
const navItems: NavItem[] = [
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "security", label: "Security", icon: Lock },
]

export function ProfileContainer() {
  const router = useRouter()
  const {logout} = useAuthStore()
  const [activeSection, setActiveSection] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const {
    user,
    isLoading,
    getProfile,
    checkUsername,
    updateUsername,
    updateProfile,
    uploadProfilePic,
    removeProfilePic,
    updateNotificationSettings,
    updatePrivacySettings,
    changePassword,
    deleteAccount,
    isCheckingUsername,
    isUploadingAvatar,
    usernameAvailable,
  } = useProfile()

  // Form setup
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
    },
  })

  const watchedUsername = watch("username")

  // Settings state
  const [settings, setSettings] = useState<SettingsState>({
    notifications: true,
    emailNotifications: true,
    darkMode: true,
    soundEnabled: true,
    notificationVolume: [70],
    showOnlineStatus: true,
    readReceipts: true,
    twoFactorAuth: false,
  })

  // Sync state with user data
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio || "",
      })

      if (user.notificationSettings || user.privacySettings) {
          setSettings(prev => ({
              ...prev,
              notifications: user.notificationSettings?.notifications ?? prev.notifications,
              emailNotifications: user.notificationSettings?.emailNotifications ?? prev.emailNotifications,
              showOnlineStatus: user.privacySettings?.showOnlineStatus ?? prev.showOnlineStatus,
              readReceipts: user.privacySettings?.readReceipts ?? prev.readReceipts,
          }))
      }
    } else {
      getProfile()
    }
  }, [user, reset, getProfile])

  // --- Avatar upload state ---
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false)

  useEffect(() => {
    if (user?.avatar && !avatarPreview) {
      setAvatarPreview(user.avatar)
    }
  }, [user?.avatar, avatarPreview])

  const MAX_FILE_SIZE = 5 * 1024 * 1024
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) return "Please upload a JPG, PNG, WebP, or GIF image"
    if (file.size > MAX_FILE_SIZE) return "Image must be less than 5MB"
    return null
  }

  const handleAvatarFileSelect = useCallback(async (file: File) => {
    const error = validateFile(file)
    if (error) {
      setAvatarError(error)
      return
    }
    setAvatarError(null)

    const reader = new FileReader()
    reader.onload = (e) => setAvatarPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    const success = await uploadProfilePic(file)
    if (!success) {
      setAvatarError("Failed to upload. Please try again.")
    }
  }, [uploadProfilePic])

  const removeAvatar = async () => {
    const success = await removeProfilePic()
    if (success) {
      setAvatarPreview(null)
      setAvatarError(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } else {
      setAvatarError("Failed to remove profile picture. Please try again.")
    }
  }

  // Username validation
  useEffect(() => {
    if (watchedUsername && watchedUsername !== user?.username) {
      const timeout = setTimeout(() => {
        checkUsername(watchedUsername)
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [watchedUsername, user?.username, checkUsername])

  const onUpdateNotificationSettings = async (newSettings: Partial<SettingsState>) => {
      const updated = { ...settings, ...newSettings }
      setSettings(updated)
      await updateNotificationSettings({
          notifications: updated.notifications,
          emailNotifications: updated.emailNotifications,
      })
  }

  const onUpdatePrivacySettings = async (newSettings: Partial<SettingsState>) => {
      const updated = { ...settings, ...newSettings }
      setSettings(updated)
      await updatePrivacySettings({
          showOnlineStatus: updated.showOnlineStatus,
          readReceipts: updated.readReceipts,
      })
  }

  // Scrolling logic
  const sectionRefs = {
    profile: useRef<HTMLDivElement>(null),
    notifications: useRef<HTMLDivElement>(null),
    privacy: useRef<HTMLDivElement>(null),
    security: useRef<HTMLDivElement>(null),
  }

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    setMobileNavOpen(false)
    const ref = sectionRefs[sectionId as keyof typeof sectionRefs]
    if (ref.current && contentRef.current) {
      const offset = ref.current.offsetTop - 24
      contentRef.current.scrollTo({ top: offset, behavior: "smooth" })
    }
  }

  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    const handleScroll = () => {
      const scrollTop = content.scrollTop + 100
      for (const [id, ref] of Object.entries(sectionRefs)) {
        if (ref.current) {
          const offsetTop = ref.current.offsetTop
          const offsetBottom = offsetTop + ref.current.offsetHeight
          if (scrollTop >= offsetTop && scrollTop < offsetBottom) {
            setActiveSection(id)
            break
          }
        }
      }
    }

    content.addEventListener("scroll", handleScroll, { passive: true })
    return () => content.removeEventListener("scroll", handleScroll)
  }, [])

  const onSave = async () => {
    // Manually trigger react-hook-form submit
    handleSubmit(onSubmit)()
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true)
    try {
      // 1. Update Name and Bio
      const profileSuccess = await updateProfile({
        name: data.name,
        bio: data.bio || "",
      })

      if (!profileSuccess) {
        setIsSaving(false)
        return
      }

      // 2. Update Username if changed
      if (data.username !== user?.username) {
        const success = await updateUsername(data.username)
        if (!success) {
          setIsSaving(false)
          return
        }
      }
      
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error("Save failed:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const onSignOut = () => {
    logout()
    router.push("/")
  }

  const onDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      const success = await deleteAccount()
      if (success) {
          logout()
          router.push("/")
      } else {
          alert("Failed to delete account. Please try again.")
      }
    }
  }


  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <ProfileHeader
        isSaving={isSaving}
        saved={saved}
        onSave={onSave}
        mobileNavOpen={mobileNavOpen}
        onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeSection={activeSection}
          onSectionClick={scrollToSection}
          navItems={navItems}
          onSignOut={onSignOut}
        />

        {mobileNavOpen && (
          <MobileSidebar
            activeSection={activeSection}
            onSectionClick={scrollToSection}
            navItems={navItems}
            onSignOut={onSignOut}
            onOverlayClick={() => setMobileNavOpen(false)}
          />
        )}

        <main
          ref={contentRef}
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="mx-auto max-w-2xl px-4 py-6 md:px-6 md:py-8">
            <SettingsSection
              id="profile"
              title="Profile Information"
              sectionRef={sectionRefs.profile}
            >
              <AvatarUpload
                fileInputRef={fileInputRef}
                avatarPreview={avatarPreview}
                isUploadingAvatar={isUploadingAvatar}
                isDraggingAvatar={isDraggingAvatar}
                avatarError={avatarError}
                userName={user?.name || ""}
                userUsername={user?.username || ""}
                onFileSelect={handleAvatarFileSelect}
                onRemove={removeAvatar}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingAvatar(true) }}
                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingAvatar(false) }}
                onDrop={(e) => {
                  e.preventDefault(); e.stopPropagation(); setIsDraggingAvatar(false)
                  const file = e.dataTransfer.files?.[0]
                  if (file) handleAvatarFileSelect(file)
                }}
              />
              <ProfileForm
                register={register}
                errors={errors}
                watchedUsername={watchedUsername}
                initialUsername={user?.username}
                usernameAvailable={usernameAvailable}
                isCheckingUsername={isCheckingUsername}
              />
            </SettingsSection>

            <SettingsSection
              id="notifications"
              title="Notifications"
              sectionRef={sectionRefs.notifications}
            >
              <NotificationSettings settings={settings} setSettings={onUpdateNotificationSettings} />
            </SettingsSection>

            <SettingsSection
              id="privacy"
              title="Privacy"
              sectionRef={sectionRefs.privacy}
            >
              <PrivacySettings settings={settings} setSettings={onUpdatePrivacySettings} />
            </SettingsSection>

            <SettingsSection
              id="security"
              title="Security"
              sectionRef={sectionRefs.security}
            >
              <SecuritySettings
                settings={settings}
                onSignOut={onSignOut}
                onDeleteAccount={onDeleteAccount}
                onPasswordSubmit={changePassword}
                isLoading={isLoading}
              />
            </SettingsSection>

            <div className="h-8" />
          </div>
        </main>
      </div>
    </div>
  )
}

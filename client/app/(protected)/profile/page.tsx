
"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  ArrowLeft,
  Camera,
  Sparkles,
  Bell,
  Moon,
  Volume2,
  Shield,
  Trash2,
  LogOut,
  Save,
  Loader2,
  Check,
  Mail,
  User,
  AtSign,
  MessageSquare,
  Settings,
  Lock,
  Palette,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useUserStore } from "@/store/useUserStore"

// Navigation items
const navItems = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "security", label: "Security", icon: Lock },
]

// Form validation types
type ProfileFormData = {
  name: string
  username: string
  email: string
  bio: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const { user, getProfile, checkUsername, updateUsername, isCheckingUsername, usernameAvailable } = useUserStore()
  
  // Form setup with react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || "User",
      username: user?.username || "UserName",
      email: user?.email || "user@example.com",
      bio: user?.bio || "",
    },
  })

  // Watch username for real-time validation
  const watchedUsername = watch("username")

  // Reset form when user data is loaded
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio || "",
      })
    } else {
      getProfile()
    }
  }, [user, reset, getProfile])

  // Debounced username check
  useEffect(() => {
    if (watchedUsername && watchedUsername !== user?.username) {
      const timeout = setTimeout(() => {
        checkUsername(watchedUsername)
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [watchedUsername, user?.username, checkUsername])

  // Settings state
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    darkMode: true,
    soundEnabled: true,
    notificationVolume: [70],
    showOnlineStatus: true,
    readReceipts: true,
    twoFactorAuth: false,
  })

  // Section refs for scroll
  const sectionRefs = {
    profile: useRef<HTMLDivElement>(null),
    notifications: useRef<HTMLDivElement>(null),
    appearance: useRef<HTMLDivElement>(null),
    privacy: useRef<HTMLDivElement>(null),
    security: useRef<HTMLDivElement>(null),
  }

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    setMobileNavOpen(false)
    const ref = sectionRefs[sectionId as keyof typeof sectionRefs]
    if (ref.current && contentRef.current) {
      const offset = ref.current.offsetTop - 24
      contentRef.current.scrollTo({ top: offset, behavior: "smooth" })
    }
  }

  // Track scroll position to update active section
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

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true)
    try {
      if (data.username !== user?.username) {
        const success = await updateUsername(data.username)
        if (!success) {
          setIsSaving(false)
          return
        }
      }
      
      // Simulate other field saves if necessary (name, email, etc. would normally have their own APIs)
      await new Promise((resolve) => setTimeout(resolve, 800))
      
      console.log("Saved:", data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error("Save failed:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      {/* Header */}
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
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="h-9 w-9 rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>

            <Button
              onClick={handleSubmit(onSubmit)}
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

      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation - Desktop */}
        <aside className="hidden w-56 flex-shrink-0 border-r border-border bg-sidebar md:block lg:w-64">
          <nav className="flex h-full flex-col p-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      activeSection === item.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        activeSection === item.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {item.label}
                    {activeSection === item.id && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Bottom links */}
            <div className="mt-auto space-y-1 border-t border-sidebar-border pt-4">
              <Link
                href="/chat"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
              >
                <MessageSquare className="h-4 w-4" />
                Back to Chat
              </Link>
              <button
                onClick={() => router.push("/sign-in")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </nav>
        </aside>

        {/* Mobile Navigation Overlay */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
            <aside className="absolute left-0 top-14 bottom-0 w-64 border-r border-border bg-sidebar p-4 shadow-xl">
              <nav className="flex h-full flex-col">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          activeSection === item.id
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 transition-colors",
                            activeSection === item.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />
                        {item.label}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-auto space-y-1 border-t border-sidebar-border pt-4">
                  <Link
                    href="/chat"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Back to Chat
                  </Link>
                  <button
                    onClick={() => router.push("/sign-in")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main
          ref={contentRef}
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="mx-auto max-w-2xl px-4 py-6 md:px-6 md:py-8">
            {/* Profile Section */}
            <section ref={sectionRefs.profile} id="profile" className="mb-8 scroll-mt-6">
              <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
                <h2 className="mb-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Profile Information
                </h2>

                {/* Avatar */}
                <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row">
                  <div className="group relative">
                    <Avatar className="h-20 w-20 ring-2 ring-border ring-offset-2 ring-offset-background md:h-24 md:w-24">
                      <AvatarImage src={user.avatar} alt={user.name}/>
                      <AvatarFallback className="bg-secondary text-lg font-semibold text-foreground">
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute inset-0 flex items-center justify-center rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
                      <Camera className="h-6 w-6 text-foreground" />
                    </button>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-foreground">{user?.name || "Alex Developer"}</h3>
                    <p className="text-sm text-muted-foreground">@{user?.username || "alexdev"}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 h-8 gap-1.5 rounded-lg border-border text-xs transition-colors hover:bg-secondary"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      Change photo
                    </Button>
                  </div>
                </div>

                {/* Form fields with validation */}
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">
                      Full name
                    </Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="name"
                        {...register("name", { required: "Name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } })}
                        className={cn(
                          "h-11 rounded-xl border-border bg-input pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary",
                          errors.name && "border-destructive focus:border-destructive focus:ring-destructive"
                        )}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-foreground">
                      Username
                    </Label>
                    <div className="relative">
                      <AtSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="username"
                        {...register("username", {
                          required: "Username is required",
                          pattern: { value: /^[a-zA-Z0-9_]+$/, message: "Only letters, numbers, and underscores" },
                          validate: () => {
                            if (watchedUsername !== user?.username && usernameAvailable === false) {
                              return "Username is already taken"
                            }
                            return true
                          }
                        })}
                        className={cn(
                          "h-11 rounded-xl border-border bg-input pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary",
                          errors.username && "border-destructive focus:border-destructive focus:ring-destructive",
                          watchedUsername !== user?.username && usernameAvailable === true && "border-online focus:border-online focus:ring-online"
                        )}
                      />
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
                        {isCheckingUsername ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : watchedUsername !== user?.username && watchedUsername.length > 0 ? (
                          usernameAvailable === true ? (
                            <Check className="h-4 w-4 text-online" />
                          ) : usernameAvailable === false ? (
                            <X className="h-4 w-4 text-destructive" />
                          ) : null
                        ) : null}
                      </div>
                    </div>
                    {errors.username && (
                      <p className="text-xs text-destructive">{errors.username.message}</p>
                    )}
                    {watchedUsername !== user?.username && usernameAvailable === true && !errors.username && (
                      <p className="text-xs text-online">Username is available</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
                        })}
                        className={cn(
                          "h-11 rounded-xl border-border bg-input pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary",
                          errors.email && "border-destructive focus:border-destructive focus:ring-destructive"
                        )}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium text-foreground">
                      Bio
                    </Label>
                    <textarea
                      id="bio"
                      {...register("bio", { maxLength: { value: 200, message: "Bio must be 200 characters or less" } })}
                      rows={3}
                      className={cn(
                        "w-full resize-none rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
                        errors.bio && "border-destructive focus:border-destructive focus:ring-destructive"
                      )}
                      placeholder="Tell us about yourself..."
                    />
                    {errors.bio && (
                      <p className="text-xs text-destructive">{errors.bio.message}</p>
                    )}
                  </div>
                </form>
              </div>
            </section>

            {/* Notifications Section */}
            <section ref={sectionRefs.notifications} id="notifications" className="mb-8 scroll-mt-6">
              <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
                <h2 className="mb-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Notifications
                </h2>

                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                        <Bell className="h-4 w-4 text-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Push notifications</p>
                        <p className="text-xs text-muted-foreground">Receive message alerts on your device</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, notifications: checked })
                      }
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                        <Mail className="h-4 w-4 text-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Email notifications</p>
                        <p className="text-xs text-muted-foreground">Receive updates via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, emailNotifications: checked })
                      }
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                          <Volume2 className="h-4 w-4 text-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Notification sound</p>
                          <p className="text-xs text-muted-foreground">Play sound for new messages</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.soundEnabled}
                        onCheckedChange={(checked) =>
                          setSettings({ ...settings, soundEnabled: checked })
                        }
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>

                    {settings.soundEnabled && (
                      <div className="ml-12 flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
                        <span className="text-xs text-muted-foreground">Volume</span>
                        <Slider
                          value={settings.notificationVolume}
                          onValueChange={(value) =>
                            setSettings({ ...settings, notificationVolume: value })
                          }
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                        <span className="w-8 text-right text-xs font-medium text-foreground">
                          {settings.notificationVolume[0]}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Appearance Section */}
            <section ref={sectionRefs.appearance} id="appearance" className="mb-8 scroll-mt-6">
              <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
                <h2 className="mb-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Appearance
                </h2>

                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                        <Moon className="h-4 w-4 text-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Dark mode</p>
                        <p className="text-xs text-muted-foreground">Use dark theme throughout the app</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.darkMode}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, darkMode: checked })
                      }
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  {/* Theme preview */}
                  <div className="rounded-xl border border-border bg-secondary/30 p-4">
                    <p className="mb-3 text-xs font-medium text-muted-foreground">Theme Preview</p>
                    <div className="flex gap-3">
                      <div className="flex-1 rounded-lg bg-message-sent p-3">
                        <p className="text-xs text-message-sent-foreground">Sent message</p>
                      </div>
                      <div className="flex-1 rounded-lg bg-message-received p-3">
                        <p className="text-xs text-message-received-foreground">Received</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy Section */}
            <section ref={sectionRefs.privacy} id="privacy" className="mb-8 scroll-mt-6">
              <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
                <h2 className="mb-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Privacy
                </h2>

                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                        <Shield className="h-4 w-4 text-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Show online status</p>
                        <p className="text-xs text-muted-foreground">Let others see when you&apos;re online</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.showOnlineStatus}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, showOnlineStatus: checked })
                      }
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                        <Check className="h-4 w-4 text-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Read receipts</p>
                        <p className="text-xs text-muted-foreground">Show when you&apos;ve read messages</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.readReceipts}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, readReceipts: checked })
                      }
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Security Section */}
            <section ref={sectionRefs.security} id="security" className="mb-8 scroll-mt-6">
              <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
                <h2 className="mb-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Security
                </h2>

                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                        <Lock className="h-4 w-4 text-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
                        <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, twoFactorAuth: checked })
                      }
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full h-10 gap-2 rounded-xl border-border text-foreground transition-colors hover:bg-secondary"
                  >
                    <Lock className="h-4 w-4" />
                    Change password
                  </Button>
                </div>
              </div>

              {/* Danger zone */}
              <div className="mt-6 rounded-2xl border border-destructive/30 bg-card p-5 md:p-6">
                <h2 className="mb-5 text-xs font-medium uppercase tracking-wider text-destructive">
                  Danger Zone
                </h2>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    className="h-10 flex-1 gap-2 rounded-xl border-border text-foreground transition-colors hover:bg-secondary"
                    onClick={() => router.push("/sign-in")}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 flex-1 gap-2 rounded-xl border-destructive/50 text-destructive transition-colors hover:bg-destructive/10 hover:border-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete account
                  </Button>
                </div>
              </div>
            </section>

            {/* Bottom padding for mobile */}
            <div className="h-8" />
          </div>
        </main>
      </div>
    </div>
  )
}

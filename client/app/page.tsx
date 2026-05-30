"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import TechStack from "@/components/landingPage/TechStack"
import CTABanner from "@/components/landingPage/CTABanner"
import Footer from "@/components/landingPage/Footer"
import {
  Sparkles,
  Shield,
  Zap,
  Users,
  Lock,
  Target,
  ArrowRight,
  Star,
  Code,
  Terminal,
  Layers,
  Bell
} from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// Navbar Component
function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
            <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">ChatSpark</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="https://github.com/akrathor18/chatSpark/" target="_blank" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            GitHub
          </Link>
          <Link href="#roadmap" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Roadmap
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm" className="hidden text-muted-foreground hover:text-foreground sm:inline-flex">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm" className="rounded-full px-4 shadow-lg shadow-primary/20">
              Join Beta
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/4 right-0 h-[600px] w-[600px] rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">Now in Public Beta</span>
            </div>

            <h1 className="text-balance text-xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              The complete platform for{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                seamless messaging
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground lg:mx-0">
              Built for speed and simplicity, ChatSpark helps you communicate in real time without unnecessary complexity. Whether you&apos;re discussing ideas, sharing updates, or exchanging code, everything happens instantly.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Link href="/sign-up">
                <Button size="lg" className="w-full rounded-full px-8 shadow-xl shadow-primary/20 sm:w-auto">
                  Join Beta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full px-8 sm:w-auto"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  View Features
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Chat Preview */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-transparent to-primary/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
              {/* Chat Header */}
              <div className="flex items-center gap-3 border-b border-border bg-secondary/30 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-destructive/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <div className="h-3 w-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted-foreground">ChatSpark</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 p-4">
                <div className="flex gap-3">
                  <div
                    className="h-8 w-8 shrink-0 rounded-full bg-secondary bg-cover bg-center"
                    style={{ backgroundImage: "url(https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop)" }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">Sarah Chen</span>
                      <span className="text-xs text-muted-foreground">10:32 AM</span>
                    </div>
                    <div className="mt-1 rounded-xl rounded-tl-sm bg-secondary px-3 py-2">
                      <p className="text-sm text-foreground">Hey! Have you checked the latest update?</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div
                    className="h-8 w-8 shrink-0 rounded-full bg-secondary bg-cover bg-center"
                    style={{ backgroundImage: "url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop)" }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">Alex Rivera</span>
                      <span className="text-xs text-muted-foreground">10:34 AM</span>
                    </div>
                    <div className="mt-1 space-y-2">
                      <div className="rounded-xl rounded-tl-sm bg-secondary px-3 py-2">
                        <p className="text-sm text-foreground">Yes, everything looks good now.</p>
                      </div>
                      <div className="overflow-hidden rounded-lg border border-border bg-background">
                        <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-3 py-1.5">
                          <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">api-routes.ts</span>
                        </div>
                        <pre className="p-3 text-xs">
                          <code className="text-primary">{"const"}</code>
                          <code className="text-foreground">{" routes = {\n"}</code>
                          <code className="text-muted-foreground">{"  "}</code>
                          <code className="text-chart-2">{"'/api/chat'"}</code>
                          <code className="text-foreground">{": handler\n}"}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="max-w-[80%]">
                    <div className="rounded-xl rounded-tr-sm bg-primary px-3 py-2">
                      <p className="text-sm text-primary-foreground">Looks great 👍</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-border bg-secondary/20 px-4 py-3">
                <div className="flex items-center gap-2 rounded-xl bg-input px-3 py-2">
                  <span className="text-sm text-muted-foreground">Message</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Real-time Messaging",
      description: "Messages delivered instantly with WebSocket technology. No delays, no refreshing.",
    },
    {
      icon: Code,
      title: "Code Sharing",
      description: "Share code snippets with syntax highlighting. Support for 100+ programming languages.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "End-to-end encryption, SSO integration, and compliance with SOC 2 and GDPR.",
    },
    {
      icon: Users,
      title: "Secure Authentication",
      description: "Login with Email, Google, or GitHub.",
    },
    {
      icon: Layers,
      title: "Private Conversations",
      description: "One-to-one messaging designed for focused communication.",
    },
    {
      icon: Target,
      title: "No distractions",
      description: "Simple, lightweight, and easy to use",
    },
  ]

  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">Features</span>
          </div>
          <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything your need to stay connected
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            ChatSpark combines fast messaging, secure authentication, and code sharing in a clean and modern experience.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Roadmap Section
function RoadmapSection() {
  const features = [
    { icon: Users, label: "Voice Channels", status: "coming" },
    { icon: Code, label: "Better File Sharing", status: "coming" },
    { icon: Zap, label: "AI Features", status: "coming" },
    { icon: Lock, label: "E2E Encryption", status: "coming" },
    { icon: Star, label: "Message Reactions", status: "coming" },
    { icon: Bell, label: "Advanced Notifications", status: "coming" },
  ]

  return (
    <section id="roadmap" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">Coming Soon</span>
          </div>
          <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            We&apos;re always building
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            ChatSpark is actively evolving. Here&apos;s what we&apos;re working on next.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/30 p-6 transition-all duration-300 hover:border-primary/40 hover:bg-card/60 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-widest text-primary/60">Coming</span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-foreground">{feature.label}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We&apos;re excited to bring this feature to ChatSpark soon.
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}


export default function LandingPage() {
  return (
    <div className="w-full overflow-hidden bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TechStack />
      <RoadmapSection />
      <CTABanner />
      <Footer />
    </div>
  )
}

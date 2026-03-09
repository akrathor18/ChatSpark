"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Home, MessageSquare, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">ChatSpark</span>
        </Link>

        {/* 404 Display */}
        <div className="relative mb-6">
          <h1 className="text-[120px] font-bold leading-none tracking-tighter text-foreground/10 sm:text-[160px] md:text-[200px]">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-xl md:h-24 md:w-24">
              <Search className="h-8 w-8 text-muted-foreground md:h-10 md:w-10" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="mb-3 text-2xl font-semibold text-foreground md:text-3xl">
          Page not found
        </h2>
        <p className="mb-8 max-w-md text-muted-foreground">
          Oops! The page you&apos;re looking for seems to have sparked away. 
          It might have been moved, deleted, or never existed.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            className="h-11 gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/25 transition-all hover:bg-primary/90"
          >
            <Link href="/chat">
              <MessageSquare className="h-4 w-4" />
              Go to Chat
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 gap-2 rounded-xl border-border px-6 text-sm font-medium text-foreground transition-all hover:bg-secondary"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Quick links */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            href="/sign-in"
            className="group flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Sign In
          </Link>
          <span className="text-border">|</span>
          <Link
            href="/sign-up"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Create Account
          </Link>
          <span className="text-border">|</span>
          <Link
            href="/profile"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Settings
          </Link>
        </div>

        {/* Decorative message bubbles */}
        <div className="mt-16 flex items-end gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <span className="text-lg">?</span>
          </div>
          <div className="rounded-2xl rounded-bl-md bg-message-received px-4 py-2.5">
            <p className="text-sm text-message-received-foreground">Where did the page go?</p>
          </div>
        </div>
        <div className="mt-2 flex flex-row-reverse items-end gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="rounded-2xl rounded-br-md bg-message-sent px-4 py-2.5">
            <p className="text-sm text-message-sent-foreground">Let me help you find your way!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

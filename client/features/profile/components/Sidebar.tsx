"use client"

import { LogOut, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { NavItem } from "../types"

interface SidebarProps {
  activeSection: string
  onSectionClick: (id: string) => void
  navItems: NavItem[]
  onSignOut: () => void
}

export function Sidebar({ activeSection, onSectionClick, navItems, onSignOut }: SidebarProps) {
  return (
    <aside className="hidden w-56 flex-shrink-0 border-r border-border bg-sidebar md:block lg:w-64">
      <nav className="flex h-full flex-col p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => onSectionClick(item.id)}
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
            onClick={onSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </nav>
    </aside>
  )
}

interface MobileSidebarProps extends SidebarProps {
  onOverlayClick: () => void
}

export function MobileSidebar({ activeSection, onSectionClick, navItems, onSignOut, onOverlayClick }: MobileSidebarProps) {
  const router = useRouter()

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onOverlayClick} />
      <aside className="absolute left-0 top-14 bottom-0 w-64 border-r border-border bg-sidebar p-4 shadow-xl">
        <nav className="flex h-full flex-col">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionClick(item.id)}
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
              onClick={onSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </nav>
      </aside>
    </div>
  )
}

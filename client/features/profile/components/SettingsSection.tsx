"use client"

import { ReactNode, RefObject } from "react"

interface SettingsSectionProps {
  id: string
  title: string
  titleColor?: string
  children: ReactNode
  sectionRef?: RefObject<HTMLDivElement | null>
}

export function SettingsSection({ id, title, titleColor = "text-muted-foreground", children, sectionRef }: SettingsSectionProps) {
  return (
    <section ref={sectionRef} id={id} className="mb-8 scroll-mt-6">
      <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
        <h2 className={`mb-5 text-xs font-medium uppercase tracking-wider ${titleColor}`}>
          {title}
        </h2>
        {children}
      </div>
    </section>
  )
}

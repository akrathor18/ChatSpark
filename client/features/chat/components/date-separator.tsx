"use client"

import { memo } from "react"

interface DateSeparatorProps {
  label: string
}

export const DateSeparator = memo(({ label }: DateSeparatorProps) => {
  return (
    <div className="flex items-center justify-center px-4 py-3">
      <div className="flex-1 h-px bg-border/60" />
      <span className="mx-3 shrink-0 select-none rounded-full bg-secondary/80 px-3.5 py-1 text-[11px] font-medium tracking-wide text-muted-foreground shadow-sm ring-1 ring-border/30">
        {label}
      </span>
      <div className="flex-1 h-px bg-border/60" />
    </div>
  )
})

DateSeparator.displayName = "DateSeparator"

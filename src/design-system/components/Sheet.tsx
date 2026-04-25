import type { PropsWithChildren } from "react"
import { cn } from "@/lib/utils"

interface SheetProps extends PropsWithChildren {
  title: string
  className?: string
}

export function Sheet({ title, className, children }: SheetProps) {
  return (
    <aside className={cn("rounded-xl border border-border bg-slate-50 p-4", className)}>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{title}</h3>
      {children}
    </aside>
  )
}

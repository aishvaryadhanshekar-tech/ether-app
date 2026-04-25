import type { PropsWithChildren } from "react"
import { cn } from "@/lib/utils"

interface CardProps extends PropsWithChildren {
  className?: string
}

export function Card({ className, children }: CardProps) {
  return (
    <section className={cn("rounded-xl border border-border bg-white p-4 shadow-sm", className)}>
      {children}
    </section>
  )
}

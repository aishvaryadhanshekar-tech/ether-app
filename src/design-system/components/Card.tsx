import type { PropsWithChildren } from "react"
import { Card as ShadcnCard } from "@/components/ui/card"
type CardProps = PropsWithChildren

export function Card({ children }: CardProps) {
  return <ShadcnCard>{children}</ShadcnCard>
}

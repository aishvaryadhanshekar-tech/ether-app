import type { ButtonHTMLAttributes } from "react"
import { Button as ShadcnButton } from "@/components/ui/button"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost"
  size?: "default" | "sm"
}

export function Button({ variant, size, ...props }: ButtonProps) {
  const resolvedVariant = variant === "primary" || variant === undefined ? "default" : variant

  return <ShadcnButton variant={resolvedVariant} size={size} {...props} />
}

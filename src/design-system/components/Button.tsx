import type { ButtonHTMLAttributes } from "react"
import { Button as ShadcnButton } from "@/components/ui/button"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost"
}

export function Button({ variant, ...props }: ButtonProps) {
  return <ShadcnButton variant={variant === "ghost" ? "ghost" : "default"} {...props} />
}

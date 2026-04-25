import type { PropsWithChildren } from "react"
import { useEffect } from "react"
import { seedApp } from "@/db/seed"

export function AppProviders({ children }: PropsWithChildren) {
  useEffect(() => {
    void seedApp()
  }, [])

  return children
}

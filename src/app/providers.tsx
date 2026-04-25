import type { PropsWithChildren } from "react"
import { useEffect } from "react"
import { seedApp } from "@/db/seed"

const LEGACY_PERSIST_KEY = "ether-db"

export function AppProviders({ children }: PropsWithChildren) {
  useEffect(() => {
    localStorage.removeItem(LEGACY_PERSIST_KEY)
    void seedApp()
  }, [])

  return children
}

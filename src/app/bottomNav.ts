import type { ComponentType } from "react"
import { Home, Plus, Send, User, Users } from "lucide-react"

export type BottomNavTab = "home" | "my-child" | "add" | "connect" | "profile"

export interface BottomNavItem {
  tab: BottomNavTab
  label: string
  path: string
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>
}

export const bottomNavItems: BottomNavItem[] = [
  { tab: "home", label: "Home", path: "/home", icon: Home },
  { tab: "my-child", label: "My Child", path: "/my-child", icon: Users },
  { tab: "add", label: "Add", path: "/add", icon: Plus },
  { tab: "connect", label: "Connect", path: "/connect", icon: Send },
  { tab: "profile", label: "Profile", path: "/profile", icon: User },
]

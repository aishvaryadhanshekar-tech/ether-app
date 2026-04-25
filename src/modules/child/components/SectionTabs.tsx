import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"

export type ChildTab = "attendance" | "timetable" | "exams" | "badges" | "learn"

interface SectionTabsProps {
  activeTab: ChildTab
}

const tabConfig: { tab: ChildTab; label: string; path: string }[] = [
  { tab: "attendance", label: "Attendance", path: "/my-child/attendance" },
  { tab: "timetable", label: "Timetable", path: "/my-child/timetable" },
  { tab: "exams", label: "Exams", path: "/my-child/exams" },
  { tab: "badges", label: "Badges", path: "/my-child/badges" },
  { tab: "learn", label: "Learn", path: "/my-child/learn" },
]

export function SectionTabs({ activeTab }: SectionTabsProps) {
  return (
    <nav className="mb-6 flex flex-wrap gap-2" aria-label="My Child sections">
      {tabConfig.map((item) => (
        <NavLink
          key={item.tab}
          to={item.path}
          className={cn(
            "rounded-full border border-border px-4 py-2 text-sm text-muted",
            activeTab === item.tab && "border-primary bg-primary text-white",
          )}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

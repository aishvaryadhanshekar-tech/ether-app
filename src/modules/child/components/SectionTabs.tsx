import { NavLink } from "react-router-dom"

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
    <nav className="section-tabs-nav" aria-label="My Child sections">
      <div className="section-tabs-list">
        {tabConfig.map((item) => (
          <NavLink
            key={item.tab}
            to={item.path}
            className="section-tabs-link"
            data-active={activeTab === item.tab ? "true" : "false"}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

import { NavLink, useLocation } from "react-router-dom"
import { bottomNavItems } from "@/app/bottomNav"

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      <div className="bottom-nav-list">
        {bottomNavItems.map((item) => {
          const Icon = item.icon
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`)

          return (
            <NavLink
              key={item.tab}
              to={item.path}
              className="bottom-nav-link"
              data-active={isActive ? "true" : "false"}
              aria-label={item.label}
            >
              <Icon className="bottom-nav-icon" aria-hidden />
              <span className="bottom-nav-label">{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

import { useCallback, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { Outlet } from "react-router-dom"
import { BottomNav } from "@/app/components/BottomNav"
import { ChildSwitcherMenu } from "@/app/components/ChildSwitcherMenu"
import { useActiveChild } from "@/shared/hooks/useActiveChild"
import {
  getChildAvatarFallback,
  getChildAvatarSrc,
  getChildGradeLabel,
} from "@/shared/utils/child"
import { useAppStore } from "@/store/rootStore"

export function AppLayout() {
  const { activeChildId } = useActiveChild()
  const children = useAppStore((state) => state.children)
  const [isSwitcherOpen, setSwitcherOpen] = useState(false)
  const switcherTriggerRef = useRef<HTMLButtonElement>(null)
  const closeSwitcher = useCallback(() => setSwitcherOpen(false), [])

  const activeChild = children[activeChildId]
  const canSwitch = Object.keys(children).length > 1

  return (
    <div className="app-layout-root">
      <div className="app-layout-shell">
        <header className="app-layout-header">
          <div className="app-layout-header-row">
            <img
              src="https://framerusercontent.com/images/Pw1TmUA0uMB2XdiOHa8NcGYDD94.png?scale-down-to=512"
              alt="Ether"
              className="app-layout-logo"
            />
            <div className="app-layout-profile-anchor">
              <button
                ref={switcherTriggerRef}
                type="button"
                className="app-layout-profile-switch"
                aria-haspopup="menu"
                aria-expanded={isSwitcherOpen}
                aria-label={
                  activeChild ? `Switch child, currently viewing ${activeChild.name}` : "Switch child"
                }
                disabled={!canSwitch}
                onClick={() => setSwitcherOpen((open) => !open)}
              >
                <div className="app-layout-profile">
                  <div className="app-layout-profile-info">
                    <p className="app-layout-profile-name">
                      {activeChild?.name ?? "Loading..."}
                    </p>
                    <p className="app-layout-profile-byline">{getChildGradeLabel(activeChild)}</p>
                  </div>
                  <img
                    src={getChildAvatarSrc(activeChild)}
                    alt=""
                    className="app-layout-profile-photo"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src = getChildAvatarFallback(activeChild?.name)
                    }}
                  />
                  {canSwitch ? (
                    <ChevronDown
                      className="app-layout-profile-chevron"
                      data-open={isSwitcherOpen ? "true" : "false"}
                      aria-hidden
                    />
                  ) : null}
                </div>
              </button>
              <ChildSwitcherMenu
                isOpen={isSwitcherOpen}
                onClose={closeSwitcher}
                triggerRef={switcherTriggerRef}
              />
            </div>
          </div>
        </header>
        <div className="app-layout-divider" />
        <main className="app-layout-main">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  )
}

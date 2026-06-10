import { Outlet } from "react-router-dom"
import { BottomNav } from "@/app/components/BottomNav"
import { useActiveChild } from "@/shared/hooks/useActiveChild"
import { useAppStore } from "@/store/rootStore"

export function AppLayout() {
  const { activeChildId } = useActiveChild()
  const activeChild = useAppStore((state) => state.children[activeChildId])
  const gradeLabel = activeChild
    ? activeChild.class.toLowerCase().startsWith("grade")
      ? `${activeChild.class}-${activeChild.section}`
      : `Grade ${activeChild.class}-${activeChild.section}`
    : "Loading child profile..."
  const avatarName = encodeURIComponent(activeChild?.name ?? "Student")
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${avatarName}&background=F4F4F5&color=171717&size=128&bold=true`
  const avatarSrc = activeChild?.photoUrl ?? fallbackAvatar

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
            <div className="app-layout-profile">
              <div className="app-layout-profile-info">
                <p className="app-layout-profile-name">
                  {activeChild?.name ?? "Loading..."}
                </p>
                <p className="app-layout-profile-byline">{gradeLabel}</p>
              </div>
              <img
                src={avatarSrc}
                alt={`${activeChild?.name ?? "Student"} profile`}
                className="app-layout-profile-photo"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = fallbackAvatar
                }}
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

export type ConnectTab = "chat" | "announcements"

interface ConnectSectionTabsProps {
  activeTab: ConnectTab
  unreadAnnouncementCount: number
  onTabChange: (tab: ConnectTab) => void
}

const tabConfig: { tab: ConnectTab; label: string }[] = [
  { tab: "chat", label: "Chat" },
  { tab: "announcements", label: "Announcements" },
]

export function ConnectSectionTabs({
  activeTab,
  unreadAnnouncementCount,
  onTabChange,
}: ConnectSectionTabsProps) {
  return (
    <nav className="connect-section-tabs" aria-label="Connect sections">
      {tabConfig.map((item) => (
        <button
          key={item.tab}
          type="button"
          className="connect-section-tab"
          data-active={activeTab === item.tab ? "true" : "false"}
          aria-pressed={activeTab === item.tab}
          onClick={() => onTabChange(item.tab)}
        >
          <span className="connect-section-tab-label">{item.label}</span>
          {item.tab === "announcements" && unreadAnnouncementCount > 0 ? (
            <span className="connect-unread-dot" aria-label={`${unreadAnnouncementCount} unread`} />
          ) : null}
        </button>
      ))}
    </nav>
  )
}

import { useMemo, useState, type ChangeEvent } from "react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import {
  ArrowLeft,
  Calendar,
  Copy,
  Download,
  FileText,
  Image,
  Info,
  Mic,
  Paperclip,
  Play,
  Search,
  Send,
  Users,
  Video,
  X,
} from "lucide-react"
import {
  ConnectSectionTabs,
  type ConnectTab,
} from "@/modules/connect/components/ConnectSectionTabs"
import { AnnouncementFilters } from "@/modules/connect/components/AnnouncementFilters"
import {
  connectAnnouncements,
  connectConversations,
} from "@/modules/connect/data/mockConnectData"
import type {
  Announcement,
  AnnouncementScopeFilter,
  AnnouncementTypeFilter,
  Conversation,
  Message,
} from "@/modules/connect/types"
import {
  announcementKindLabels,
} from "@/modules/connect/types"
import { PageTitle } from "@/shared/components/PageTitle"
import { useActiveChild } from "@/shared/hooks/useActiveChild"
import { useAppStore } from "@/store/rootStore"

dayjs.extend(relativeTime)

const ANNOUNCEMENT_BODY_CLAMP_THRESHOLD = 180

function formatTime(value: string) {
  return dayjs(value).format("h:mm A")
}

function formatShortDate(value: string) {
  return dayjs(value).format("D MMM")
}

function formatRelativeTime(value: string) {
  return dayjs(value).fromNow()
}

function authorInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function sortAnnouncements(announcements: Announcement[]) {
  return announcements.slice().sort((a, b) => {
    if (a.pinned && !b.pinned) {
      return -1
    }
    if (!a.pinned && b.pinned) {
      return 1
    }
    return dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf()
  })
}

function filterAnnouncements(
  announcements: Announcement[],
  typeFilter: AnnouncementTypeFilter,
  scopeFilter: AnnouncementScopeFilter,
  searchQuery: string,
) {
  const normalizedSearch = searchQuery.trim().toLowerCase()

  const filtered = announcements.filter((announcement) => {
    if (typeFilter !== "all" && announcement.kind !== typeFilter) {
      return false
    }
    if (scopeFilter !== "all" && announcement.scope !== scopeFilter) {
      return false
    }
    if (!normalizedSearch) {
      return true
    }

    const searchable = [
      announcement.title,
      announcement.preview,
      announcement.body,
      announcement.author,
      announcement.groupName,
      announcement.kudos?.awardTitle,
      announcement.kudos?.comment,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    return searchable.includes(normalizedSearch)
  })

  return sortAnnouncements(filtered)
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export function ConnectScreen() {
  const { activeChildId } = useActiveChild()
  const activeChild = useAppStore((state) => state.children[activeChildId])
  const [activeConnectTab, setActiveConnectTab] = useState<ConnectTab>("chat")
  const [searchQuery, setSearchQuery] = useState("")
  const [announcementSearchQuery, setAnnouncementSearchQuery] = useState("")
  const [announcementTypeFilter, setAnnouncementTypeFilter] =
    useState<AnnouncementTypeFilter>("all")
  const [announcementScopeFilter, setAnnouncementScopeFilter] =
    useState<AnnouncementScopeFilter>("all")
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false)
  const [draft, setDraft] = useState("")
  const [replyTo, setReplyTo] = useState<Message | null>(null)
  const [sentMessages, setSentMessages] = useState<Record<string, Message[]>>({})

  const announcements = connectAnnouncements[activeChildId] ?? []
  const conversations = useMemo(
    () => {
      const baseConversations = connectConversations[activeChildId] ?? []
      return baseConversations.map((conversation) => ({
        ...conversation,
        messages: [
          ...conversation.messages,
          ...(sentMessages[conversation.id] ?? []),
        ],
      }))
    },
    [activeChildId, sentMessages],
  )
  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedConversationId) ??
    null

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const chatConversations = useMemo(
    () =>
      conversations
        .filter((conversation) => !conversation.name.toLowerCase().includes("announcements"))
        .slice()
        .sort((a, b) => dayjs(b.latestAt).valueOf() - dayjs(a.latestAt).valueOf()),
    [conversations],
  )
  const searchResults = useMemo(() => {
    if (!normalizedQuery) {
      return { groups: [], teachers: [], messages: [] }
    }

    const groups = chatConversations.filter((conversation) =>
      [conversation.name, conversation.description, conversation.kind]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    )
    const teachers = chatConversations.filter((conversation) =>
      conversation.teachers.some((teacher) =>
        teacher.name.toLowerCase().includes(normalizedQuery),
      ),
    )
    const messages = chatConversations.filter((conversation) =>
      conversation.messages.some((message) =>
        message.text.toLowerCase().includes(normalizedQuery),
      ),
    )

    return { groups, teachers, messages }
  }, [chatConversations, normalizedQuery])
  const unreadAnnouncementCount = announcements.filter((announcement) => announcement.unread).length

  function openConversation(id: string) {
    setSelectedConversationId(id)
    setIsGroupInfoOpen(false)
    setReplyTo(null)
  }

  function sendMessage() {
    if (!selectedConversation || draft.trim().length === 0) {
      return
    }

    const message: Message = {
      id: `local_${selectedConversation.id}_${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: "current_parent",
      senderName: "You",
      senderRole: "parent",
      kind: "text",
      text: draft.trim(),
      timestamp: new Date().toISOString(),
      quote: replyTo
        ? { senderName: replyTo.senderName, text: replyTo.text }
        : undefined,
    }

    setSentMessages((current) => ({
      ...current,
      [selectedConversation.id]: [
        ...(current[selectedConversation.id] ?? []),
        message,
      ],
    }))
    setDraft("")
    setReplyTo(null)
  }

  function attachFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!selectedConversation || !file) {
      return
    }

    const extension = file.name.split(".").pop()?.toUpperCase() ?? "FILE"
    const message: Message = {
      id: `upload_${selectedConversation.id}_${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: "current_parent",
      senderName: "You",
      senderRole: "parent",
      kind: "document",
      text: "Uploaded an attachment.",
      timestamp: new Date().toISOString(),
      attachment: {
        id: `file_${Date.now()}`,
        name: file.name,
        extension,
        sizeLabel: `${Math.max(file.size / 1024 / 1024, 0.1).toFixed(1)} MB`,
        status: "ready",
      },
    }

    setSentMessages((current) => ({
      ...current,
      [selectedConversation.id]: [
        ...(current[selectedConversation.id] ?? []),
        message,
      ],
    }))
    event.target.value = ""
  }

  if (selectedConversation && isGroupInfoOpen) {
    return (
      <GroupInfoView
        conversation={selectedConversation}
        onBack={() => setIsGroupInfoOpen(false)}
      />
    )
  }

  if (selectedConversation) {
    return (
      <ChatView
        conversation={selectedConversation}
        draft={draft}
        replyTo={replyTo}
        onAttachFile={attachFile}
        onBack={() => setSelectedConversationId(null)}
        onDraftChange={setDraft}
        onGroupInfo={() => setIsGroupInfoOpen(true)}
        onReply={setReplyTo}
        onSend={sendMessage}
        onCancelReply={() => setReplyTo(null)}
      />
    )
  }

  return (
    <section className="connect-screen">
      <PageTitle subtitle={`${activeChild?.name ?? "Active child"} conversations`}>
        Connect
      </PageTitle>

      <ConnectSectionTabs
        activeTab={activeConnectTab}
        unreadAnnouncementCount={unreadAnnouncementCount}
        onTabChange={setActiveConnectTab}
      />

      {activeConnectTab === "chat" ? (
        <>
          <label className="connect-search">
            <Search className="connect-search-icon" aria-hidden />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search groups, teachers, messages"
              className="connect-search-input"
              aria-label="Search conversations"
            />
            {searchQuery ? (
              <button
                type="button"
                className="connect-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <X className="connect-search-clear-icon" aria-hidden />
              </button>
            ) : null}
          </label>

          {normalizedQuery ? (
            <SearchResults
              groups={searchResults.groups}
              teachers={searchResults.teachers}
              messages={searchResults.messages}
              onOpenConversation={openConversation}
            />
          ) : (
            <ChatsList
              conversations={chatConversations}
              onOpenConversation={openConversation}
            />
          )}
        </>
      ) : (
        <AnnouncementFeed
          announcements={announcements}
          searchQuery={announcementSearchQuery}
          typeFilter={announcementTypeFilter}
          scopeFilter={announcementScopeFilter}
          onSearchChange={setAnnouncementSearchQuery}
          onTypeFilterChange={setAnnouncementTypeFilter}
          onScopeFilterChange={setAnnouncementScopeFilter}
        />
      )}
    </section>
  )
}

function AnnouncementFeed({
  announcements,
  searchQuery,
  typeFilter,
  scopeFilter,
  onSearchChange,
  onTypeFilterChange,
  onScopeFilterChange,
}: {
  announcements: Announcement[]
  searchQuery: string
  typeFilter: AnnouncementTypeFilter
  scopeFilter: AnnouncementScopeFilter
  onSearchChange: (query: string) => void
  onTypeFilterChange: (filter: AnnouncementTypeFilter) => void
  onScopeFilterChange: (filter: AnnouncementScopeFilter) => void
}) {
  const filteredAnnouncements = useMemo(
    () => filterAnnouncements(announcements, typeFilter, scopeFilter, searchQuery),
    [announcements, typeFilter, scopeFilter, searchQuery],
  )

  if (announcements.length === 0) {
    return (
      <>
        <AnnouncementFilters
          searchQuery={searchQuery}
          typeFilter={typeFilter}
          scopeFilter={scopeFilter}
          onSearchChange={onSearchChange}
          onTypeFilterChange={onTypeFilterChange}
          onScopeFilterChange={onScopeFilterChange}
        />
        <EmptyState
          title="No announcements"
          subtitle="School updates for this child will appear here"
        />
      </>
    )
  }

  return (
    <>
      <AnnouncementFilters
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        scopeFilter={scopeFilter}
        onSearchChange={onSearchChange}
        onTypeFilterChange={onTypeFilterChange}
        onScopeFilterChange={onScopeFilterChange}
      />

      {filteredAnnouncements.length === 0 ? (
        <EmptyState
          title="No matching announcements"
          subtitle="Try adjusting your search or filters"
        />
      ) : (
        <div className="announcement-feed">
          {filteredAnnouncements.map((announcement) => (
            <AnnouncementPost key={announcement.id} announcement={announcement} />
          ))}
        </div>
      )}
    </>
  )
}

function AnnouncementPost({ announcement }: { announcement: Announcement }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isKudos = announcement.kind === "kudos" && announcement.kudos
  const isClamped =
    !isKudos && announcement.body.length > ANNOUNCEMENT_BODY_CLAMP_THRESHOLD

  return (
    <article className="announcement-post" data-kind={announcement.kind}>
      <header className="announcement-post-header">
        <span className="connect-avatar connect-avatar-small">
          {authorInitials(announcement.author)}
        </span>
        <div className="announcement-post-header-copy">
          <div className="announcement-post-author-row">
            <span className="announcement-post-author">{announcement.author}</span>
            <span className="announcement-post-time">
              {formatRelativeTime(announcement.timestamp)}
            </span>
          </div>
          <span className="announcement-post-group">{announcement.groupName}</span>
        </div>
        {announcement.unread ? <span className="connect-unread-dot" /> : null}
      </header>

      <h3 className="announcement-post-title">{announcement.title}</h3>

      {isKudos ? (
        <div className="announcement-kudos">
          <div className="announcement-kudos-award">
            <span className="announcement-kudos-icon" aria-hidden>
              {announcement.kudos!.awardIcon}
            </span>
            <span className="announcement-kudos-recipient">
              Awarded to {announcement.kudos!.awardedTo}
            </span>
          </div>
          {announcement.kudos!.comment ? (
            <p className="announcement-kudos-comment">
              &ldquo;{announcement.kudos!.comment}&rdquo;
            </p>
          ) : null}
        </div>
      ) : (
        <>
          <p
            className={cx(
              "announcement-post-body",
              isClamped && !isExpanded && "announcement-post-body-clamped",
            )}
          >
            {announcement.body}
          </p>

          {isClamped ? (
            <button
              type="button"
              className="announcement-post-see-more"
              onClick={() => setIsExpanded((current) => !current)}
            >
              {isExpanded ? "See less" : "See more"}
            </button>
          ) : null}
        </>
      )}

      <footer className="announcement-post-footer">
        <span
          className="announcement-type-label"
          data-kind={announcement.kind}
        >
          {announcementKindLabels[announcement.kind]}
        </span>
        {announcement.eventDate ? (
          <span className="announcement-post-meta" data-kind={announcement.kind}>
            <Calendar className="announcement-post-meta-icon" aria-hidden />
            {formatShortDate(announcement.eventDate)}
            {announcement.eventMeta ? ` · ${announcement.eventMeta}` : ""}
          </span>
        ) : null}
      </footer>

      {announcement.attachment ? (
        <AttachmentCard attachment={announcement.attachment} />
      ) : null}
    </article>
  )
}

function ChatsList({
  conversations,
  onOpenConversation,
}: {
  conversations: Conversation[]
  onOpenConversation: (id: string) => void
}) {
  if (conversations.length === 0) {
    return (
      <EmptyState
        title="No conversations yet"
        subtitle="Groups created by teachers will appear here"
      />
    )
  }

  return (
    <div className="chat-list">
      {conversations.map((conversation) => (
        <ConversationRow
          key={conversation.id}
          conversation={conversation}
          onOpenConversation={onOpenConversation}
        />
      ))}
    </div>
  )
}

function SearchResults({
  groups,
  teachers,
  messages,
  onOpenConversation,
}: {
  groups: Conversation[]
  teachers: Conversation[]
  messages: Conversation[]
  onOpenConversation: (id: string) => void
}) {
  if (groups.length === 0 && teachers.length === 0 && messages.length === 0) {
    return (
      <EmptyState
        title="No results found"
        subtitle="Try a group, teacher, or message keyword"
      />
    )
  }

  return (
    <div className="connect-content-stack">
      {groups.length > 0 ? (
        <SearchResultSection
          title="Groups"
          conversations={groups}
          onOpenConversation={onOpenConversation}
        />
      ) : null}
      {teachers.length > 0 ? (
        <SearchResultSection
          title="Teachers"
          conversations={teachers}
          onOpenConversation={onOpenConversation}
        />
      ) : null}
      {messages.length > 0 ? (
        <SearchResultSection
          title="Messages"
          conversations={messages}
          onOpenConversation={onOpenConversation}
        />
      ) : null}
    </div>
  )
}

function SearchResultSection({
  title,
  conversations,
  onOpenConversation,
}: {
  title: string
  conversations: Conversation[]
  onOpenConversation: (id: string) => void
}) {
  return (
    <section className="connect-section">
      <h2 className="connect-section-title">{title}</h2>
      <div className="chat-list">
        {conversations.map((conversation) => (
          <ConversationRow
            key={conversation.id}
            conversation={conversation}
            onOpenConversation={onOpenConversation}
          />
        ))}
      </div>
    </section>
  )
}

function ConversationRow({
  conversation,
  onOpenConversation,
}: {
  conversation: Conversation
  onOpenConversation: (id: string) => void
}) {
  return (
    <button
      type="button"
      className="chat-list-row"
      onClick={() => onOpenConversation(conversation.id)}
    >
      <span className="connect-avatar">{conversation.avatarLabel}</span>
      <span className="chat-list-body">
        <span className="chat-list-title-row">
          <span className="chat-list-title">{conversation.name}</span>
          <span className="chat-list-time">{formatShortDate(conversation.latestAt)}</span>
        </span>
        <span className="chat-list-preview-row">
          <span className="chat-list-preview">{conversation.latestMessage}</span>
          {conversation.unreadCount > 0 ? (
            <span className="chat-list-unread">{conversation.unreadCount}</span>
          ) : null}
        </span>
      </span>
    </button>
  )
}

function ChatView({
  conversation,
  draft,
  replyTo,
  onAttachFile,
  onBack,
  onCancelReply,
  onDraftChange,
  onGroupInfo,
  onReply,
  onSend,
}: {
  conversation: Conversation
  draft: string
  replyTo: Message | null
  onAttachFile: (event: ChangeEvent<HTMLInputElement>) => void
  onBack: () => void
  onCancelReply: () => void
  onDraftChange: (value: string) => void
  onGroupInfo: () => void
  onReply: (message: Message) => void
  onSend: () => void
}) {
  return (
    <section className="chat-screen">
      <header className="chat-header">
        <button type="button" className="chat-icon-button" onClick={onBack} aria-label="Back to Connect">
          <ArrowLeft className="chat-icon" aria-hidden />
        </button>
        <button type="button" className="chat-header-main" onClick={onGroupInfo}>
          <span className="connect-avatar connect-avatar-small">{conversation.avatarLabel}</span>
          <span className="chat-header-copy">
            <span className="chat-header-title">{conversation.name}</span>
            <span className="chat-header-subtitle">{conversation.memberCount} members</span>
          </span>
        </button>
        <button type="button" className="chat-icon-button" onClick={onGroupInfo} aria-label="Group information">
          <Info className="chat-icon" aria-hidden />
        </button>
      </header>

      <div className="message-list">
        {conversation.messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderName === "You"}
            onReply={() => onReply(message)}
          />
        ))}
      </div>

      <footer className="chat-composer">
        {replyTo ? (
          <div className="reply-preview">
            <span className="reply-preview-copy">
              <span className="reply-preview-author">{replyTo.senderName}</span>
              <span className="reply-preview-text">{replyTo.text}</span>
            </span>
            <button type="button" className="reply-preview-close" onClick={onCancelReply} aria-label="Cancel reply">
              <X className="chat-icon" aria-hidden />
            </button>
          </div>
        ) : null}
        <div className="composer-row">
          <label className="composer-attach" aria-label="Attach file">
            <Paperclip className="chat-icon" aria-hidden />
            <input type="file" className="composer-file-input" onChange={onAttachFile} />
          </label>
          <textarea
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            placeholder="Message"
            className="composer-input"
            rows={1}
          />
          <button
            type="button"
            className="composer-send"
            onClick={onSend}
            disabled={draft.trim().length === 0}
            aria-label="Send message"
          >
            <Send className="chat-icon" aria-hidden />
          </button>
        </div>
      </footer>
    </section>
  )
}

function MessageBubble({
  message,
  isOwn,
  onReply,
}: {
  message: Message
  isOwn: boolean
  onReply: () => void
}) {
  return (
    <article className={cx("message-row", isOwn && "message-row-own")}>
      <div className={cx("message-bubble", isOwn && "message-bubble-own")}>
        {!isOwn ? <p className="message-sender">{message.senderName}</p> : null}
        {message.quote ? (
          <div className="message-quote">
            <span className="message-quote-author">{message.quote.senderName}</span>
            <span className="message-quote-text">{message.quote.text}</span>
          </div>
        ) : null}
        <MessageContent message={message} />
        <div className="message-actions-row">
          <button type="button" className="message-action" onClick={onReply}>
            Reply
          </button>
          <button type="button" className="message-action">
            <Copy className="message-action-icon" aria-hidden />
            Copy
          </button>
          <span className="message-time">{formatTime(message.timestamp)}</span>
        </div>
      </div>
    </article>
  )
}

function MessageContent({ message }: { message: Message }) {
  if (message.kind === "voice") {
    return (
      <div className="voice-note">
        <Mic className="voice-note-icon" aria-hidden />
        <span className="voice-waveform" aria-hidden>
          {Array.from({ length: 18 }).map((_, index) => (
            <span key={index} style={{ height: `${8 + (index % 5) * 4}px` }} />
          ))}
        </span>
        <span className="voice-note-time">0:18</span>
      </div>
    )
  }

  if (message.kind === "image" || message.kind === "video") {
    const Icon = message.kind === "image" ? Image : Video
    return (
      <div className="media-card">
        <Icon className="media-card-icon" aria-hidden />
        {message.kind === "video" ? <Play className="media-play-icon" aria-hidden /> : null}
        <span>{message.text}</span>
      </div>
    )
  }

  if (message.kind === "announcement" || message.kind === "event") {
    return (
      <div className="structured-message-card">
        <span className="structured-message-title">{message.text.split(":")[0]}</span>
        <span className="structured-message-copy">{message.text.includes(":") ? message.text.split(":").slice(1).join(":").trim() : message.text}</span>
        {message.eventDate ? (
          <span className="structured-message-meta">
            {formatShortDate(message.eventDate)} · {message.eventMeta}
          </span>
        ) : null}
      </div>
    )
  }

  if (message.kind === "circular" || message.kind === "document" || message.attachment) {
    return (
      <>
        <p className="message-text">{message.text}</p>
        {message.attachment ? <AttachmentCard attachment={message.attachment} /> : null}
      </>
    )
  }

  return <p className="message-text">{message.text}</p>
}

function AttachmentCard({
  attachment,
}: {
  attachment: NonNullable<Message["attachment"]>
}) {
  return (
    <div className="attachment-card" data-status={attachment.status ?? "ready"}>
      <FileText className="attachment-icon" aria-hidden />
      <span className="attachment-copy">
        <span className="attachment-name">{attachment.name}</span>
        <span className="attachment-meta">
          {attachment.extension}
          {attachment.sizeLabel ? ` · ${attachment.sizeLabel}` : ""}
        </span>
      </span>
      <button type="button" className="attachment-download" aria-label={`Download ${attachment.name}`}>
        <Download className="attachment-download-icon" aria-hidden />
      </button>
    </div>
  )
}

function GroupInfoView({
  conversation,
  onBack,
}: {
  conversation: Conversation
  onBack: () => void
}) {
  return (
    <section className="group-info-screen">
      <header className="chat-header">
        <button type="button" className="chat-icon-button" onClick={onBack} aria-label="Back to chat">
          <ArrowLeft className="chat-icon" aria-hidden />
        </button>
        <div className="chat-header-copy">
          <span className="chat-header-title">Group Info</span>
          <span className="chat-header-subtitle">{conversation.memberCount} members</span>
        </div>
      </header>

      <div className="group-info-hero">
        <span className="connect-avatar group-info-avatar">{conversation.avatarLabel}</span>
        <h1 className="group-info-title">{conversation.name}</h1>
        <p className="group-info-description">{conversation.description}</p>
      </div>

      <section className="group-info-section">
        <h2 className="connect-section-title">Teachers</h2>
        <div className="member-list">
          {conversation.teachers.map((member) => (
            <MemberRow key={member.id} name={member.name} avatarUrl={member.avatarUrl} meta={member.role === "school" ? "School" : "Teacher"} />
          ))}
        </div>
      </section>

      <section className="group-info-section">
        <h2 className="connect-section-title">Parents</h2>
        <div className="member-list">
          {conversation.parents.map((member) => (
            <MemberRow key={member.id} name={member.name} avatarUrl={member.avatarUrl} meta="Parent" />
          ))}
        </div>
      </section>

      <section className="group-info-section">
        <h2 className="connect-section-title">Shared Files</h2>
        <div className="shared-files-list">
          {conversation.sharedFiles.length > 0 ? (
            conversation.sharedFiles.map((file) => (
              <AttachmentCard key={file.id} attachment={file} />
            ))
          ) : (
            <p className="group-info-empty">No shared files yet</p>
          )}
        </div>
      </section>
    </section>
  )
}

function MemberRow({
  name,
  avatarUrl,
  meta,
}: {
  name: string
  avatarUrl?: string
  meta: string
}) {
  return (
    <div className="member-row">
      {avatarUrl ? (
        <img src={avatarUrl} alt="" className="member-avatar" loading="lazy" />
      ) : (
        <span className="member-avatar member-avatar-fallback">
          <Users className="member-avatar-icon" aria-hidden />
        </span>
      )}
      <span className="member-copy">
        <span className="member-name">{name}</span>
        <span className="member-meta">{meta}</span>
      </span>
    </div>
  )
}

function EmptyState({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="connect-empty-state">
      <div className="connect-empty-illustration" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <p className="connect-empty-title">{title}</p>
      {subtitle ? <p className="connect-empty-subtitle">{subtitle}</p> : null}
    </div>
  )
}

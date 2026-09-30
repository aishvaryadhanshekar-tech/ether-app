export type ConversationKind =
  | "academic"
  | "school"
  | "activity"
  | "temporary"

export type MessageKind =
  | "text"
  | "image"
  | "document"
  | "video"
  | "voice"
  | "announcement"
  | "circular"
  | "event"

export interface Member {
  id: string
  name: string
  role: "teacher" | "parent" | "school"
  avatarUrl?: string
}

export interface Attachment {
  id: string
  name: string
  extension: string
  sizeLabel?: string
  status?: "ready" | "retry"
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderRole: Member["role"]
  kind: MessageKind
  text: string
  timestamp: string
  attachment?: Attachment
  quote?: {
    senderName: string
    text: string
  }
  eventDate?: string
  eventMeta?: string
}

export type AnnouncementKind = "announcement" | "kudos" | "circular" | "event"

export type AnnouncementScope = "school" | "class"

export type AnnouncementTypeFilter = "all" | AnnouncementKind

export type AnnouncementScopeFilter = "all" | AnnouncementScope

export interface AnnouncementKudos {
  awardTitle: string
  awardIcon: string
  awardedTo: string
  comment?: string
}

export interface Announcement {
  id: string
  conversationId: string
  kind: AnnouncementKind
  scope: AnnouncementScope
  title: string
  author: string
  groupName: string
  timestamp: string
  preview: string
  body: string
  attachment?: Attachment
  eventDate?: string
  eventMeta?: string
  kudos?: AnnouncementKudos
  pinned?: boolean
  unread?: boolean
}

export const announcementKindLabels: Record<AnnouncementKind, string> = {
  announcement: "Announcement",
  kudos: "Kudos",
  circular: "Circular",
  event: "Event",
}

export const announcementScopeLabels: Record<AnnouncementScope, string> = {
  school: "School-wide",
  class: "Class",
}

export interface Conversation {
  id: string
  childId: string
  name: string
  description: string
  kind: ConversationKind
  avatarLabel: string
  memberCount: number
  unreadCount: number
  latestMessage: string
  latestAt: string
  teachers: Member[]
  parents: Member[]
  sharedFiles: Attachment[]
  messages: Message[]
}

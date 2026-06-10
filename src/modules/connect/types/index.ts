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

export interface Announcement {
  id: string
  conversationId: string
  kind: "announcement" | "circular" | "event"
  title: string
  author: string
  groupName: string
  timestamp: string
  preview: string
  body: string
  attachment?: Attachment
  eventDate?: string
  eventMeta?: string
  pinned?: boolean
  unread?: boolean
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

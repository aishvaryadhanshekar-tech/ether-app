export type BadgeTone = "sun" | "mint" | "sky" | "rose"

export interface BadgeType {
  id: string
  title: string
  icon: string
  tone: BadgeTone
}

export interface Badge {
  id: string
  childId: string
  badgeTypeId: string
  title: string
  icon: string
  tone?: BadgeTone
  awardedBy: {
    teacherName: string
    role: string
  }
  comment?: string
  awardedAt: string
  isNew?: boolean
}

export const badgeTypes: BadgeType[] = [
  { id: "kindness-star", title: "Kindness Star", icon: "🌟", tone: "sun" },
  { id: "team-player", title: "Team Player", icon: "🤝", tone: "sky" },
  { id: "creative-thinker", title: "Creative Thinker", icon: "🎨", tone: "rose" },
  { id: "focused-learner", title: "Focused Learner", icon: "📚", tone: "mint" },
]

export interface Badge {
  id: string
  childId: string
  title: string
  icon: string
  awardedBy: {
    teacherName: string
    role: string
  }
  comment?: string
  awardedAt: string
  isNew?: boolean
}

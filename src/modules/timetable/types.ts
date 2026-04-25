export interface Period {
  id: string
  subject: string
  teacherName: string
  startTime: string
  endTime: string
  isBreak?: boolean
}

export type TimetableDayName = "mon" | "tue" | "wed" | "thu" | "fri"

export interface TimetableDay {
  day: TimetableDayName
  periods: Period[]
}

export interface TimetableWeek {
  childId: string
  weekStartDate: string
  days: TimetableDay[]
}

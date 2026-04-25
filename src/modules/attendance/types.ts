export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "holiday"
  | "weekend"
  | "not_marked"

export interface AttendanceEntry {
  id: string
  childId: string
  date: string
  status: AttendanceStatus
  markedAt?: string
  periodsPresent?: number
  absentNote?: {
    note: string
    submittedAt: string
  }
  isSchoolDay: boolean
  // Transitional alias for existing UI components.
  note?: string
}

export type AttendanceByChild = Record<string, AttendanceEntry[]>

export interface AttendanceSummary {
  present: number
  absent: number
  late: number
}

export interface AttendanceAnomaly {
  date: string
  status: "absent" | "late"
  reason?: string
  needsAction: boolean
  hasNote: boolean
}

export interface CalendarCellData {
  date: string
  dayNumber: number
  status: AttendanceStatus
  isCurrentMonth: boolean
  isToday: boolean
  isDisabled: boolean
}

export type CalendarMatrix = CalendarCellData[][]

export type AttendanceEntryStatus = "present" | "absent" | "late" | "holiday"
export type AttendanceStatus = AttendanceEntryStatus | "not_marked"

export interface AttendanceEntry {
  date: string
  status: AttendanceEntryStatus
  markedAt?: string
  note?: string
}

export type AttendanceByChild = Record<string, AttendanceEntry[]>

export interface CalendarCellData {
  date: string
  dayNumber: number
  status: AttendanceStatus
  isCurrentMonth: boolean
  isToday: boolean
  isDisabled: boolean
}

export type CalendarMatrix = CalendarCellData[][]

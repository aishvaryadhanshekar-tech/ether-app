import type { AttendanceEntry } from "@/modules/attendance/types"
import type { ExamEntry } from "@/modules/exams/types"

export interface Child {
  id: string
  name: string
  className: string
}

export interface SeedSchema {
  children: Child[]
  attendance: Record<string, AttendanceEntry[]>
  exams: Record<string, ExamEntry[]>
}

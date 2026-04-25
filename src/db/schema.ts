import type { AttendanceEntry } from "@/modules/attendance/types"
import type { Child } from "@/modules/child/types"
import type { TimetableWeek } from "@/modules/timetable/types"
import type { Exam, ExamResult } from "@/modules/exams/types"
import type { Badge } from "@/modules/badges/types"
import type { LearnSession } from "@/modules/learn/types"

export interface SeedSchema {
  children: Record<string, Child>
  attendance: Record<string, AttendanceEntry[]>
  timetable: Record<string, TimetableWeek>
  exams: Record<string, Exam[]>
  results: Record<string, ExamResult[]>
  badges: Record<string, Badge[]>
  learnSession: Record<string, LearnSession>
}

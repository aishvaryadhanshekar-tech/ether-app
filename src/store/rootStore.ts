import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  createAttendanceSlice,
  type AttendanceSlice,
} from "@/modules/attendance/store"
import type { AttendanceByChild } from "@/modules/attendance/types"
import { createContextSlice, type ContextSlice } from "@/store/contextStore"
import { createExamSlice, type ExamsSlice } from "@/modules/exams/store"
import { persistOptions } from "@/store/persistence"
import type { Child } from "@/modules/child/types"
import type { TimetableWeek } from "@/modules/timetable/types"
import type { Exam, ExamResult } from "@/modules/exams/types"
import type { Badge } from "@/modules/badges/types"
import type { LearnSession } from "@/modules/learn/types"

export interface AppDataSchema {
  children: Record<string, Child>
  attendance: AttendanceByChild
  timetable: Record<string, TimetableWeek>
  exams: Record<string, Exam[]>
  results: Record<string, ExamResult[]>
  badges: Record<string, Badge[]>
  learnSession: Record<string, LearnSession>
}

export type AppStore = AppDataSchema & ContextSlice & AttendanceSlice & ExamsSlice

export const useAppStore = create<AppStore>()(
  persist(
    (...args) => ({
      ...createContextSlice(...args),
      ...createAttendanceSlice(...args),
      ...createExamSlice(...args),
    }),
    persistOptions,
  ),
)

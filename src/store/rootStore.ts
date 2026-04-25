import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  createAttendanceSlice,
  type AttendanceSlice,
} from "@/modules/attendance/store"
import { createContextSlice, type ContextSlice } from "@/store/contextStore"
import { createExamSlice, type ExamsSlice } from "@/modules/exams/store"
import { persistOptions } from "@/store/persistence"

export type AppStore = ContextSlice & AttendanceSlice & ExamsSlice

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

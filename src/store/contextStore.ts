import type { StateCreator } from "zustand"
import type { AppStore } from "@/store/rootStore"
import type { Child } from "@/modules/child/types"
import type { TimetableWeek } from "@/modules/timetable/types"
import type { ExamResult } from "@/modules/exams/types"
import type { Badge } from "@/modules/badges/types"
import type { LearnSession } from "@/modules/learn/types"

export interface ContextSlice {
  activeChildId: string
  setActiveChild: (id: string) => void
  children: Record<string, Child>
  timetable: Record<string, TimetableWeek>
  results: Record<string, ExamResult[]>
  badges: Record<string, Badge[]>
  learnSession: Record<string, LearnSession>
}

export const createContextSlice: StateCreator<AppStore, [], [], ContextSlice> = (
  set,
) => ({
  activeChildId: "child_1",
  setActiveChild: (id) => set({ activeChildId: id }),
  children: {},
  timetable: {},
  results: {},
  badges: {},
  learnSession: {},
})

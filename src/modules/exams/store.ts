import type { StateCreator } from "zustand"
import type { AppStore } from "@/store/rootStore"
import type { ExamEntry, ExamsByChild } from "@/modules/exams/types"

export interface ExamsSlice {
  exams: ExamsByChild
  upsertExams: (childId: string, entries: ExamEntry[]) => void
}

export const createExamSlice: StateCreator<AppStore, [], [], ExamsSlice> = (
  set,
  get,
) => ({
  exams: {},
  upsertExams: (childId, entries) => {
    set({
      exams: {
        ...get().exams,
        [childId]: entries,
      },
    })
  },
})

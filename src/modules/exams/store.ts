import type { StateCreator } from "zustand"
import type { AppStore } from "@/store/rootStore"
import type {
  ExamEntry,
  ExamResult,
  ExamsByChild,
  ExamResultsByChild,
} from "@/modules/exams/types"

export interface ExamsSlice {
  exams: ExamsByChild
  results: ExamResultsByChild
  upsertExams: (childId: string, entries: ExamEntry[]) => void
  upsertResults: (childId: string, entries: ExamResult[]) => void
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
  results: {},
  upsertResults: (childId, entries) => {
    set({
      results: {
        ...get().results,
        [childId]: entries,
      },
    })
  },
})

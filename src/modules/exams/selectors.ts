import { useMemo } from "react"
import dayjs from "dayjs"
import { useAppStore } from "@/store/rootStore"
import type { Exam, ExamResult } from "@/modules/exams/types"

const EMPTY_EXAMS: Exam[] = []
const EMPTY_RESULTS: ExamResult[] = []

function resolveExamDate(exam: Exam) {
  return exam.date ?? exam.examDate ?? ""
}

export function useExams(childId: string) {
  const exams = useAppStore((state) => state.exams[childId] ?? EMPTY_EXAMS)
  return useMemo(
    () =>
      [...exams].sort(
        (a, b) => dayjs(resolveExamDate(a)).valueOf() - dayjs(resolveExamDate(b)).valueOf(),
      ),
    [exams],
  )
}

export function useUpcomingExams(childId: string) {
  return useExams(childId)
}

export function useExamResults(childId: string) {
  const results = useAppStore((state) => state.results[childId] ?? EMPTY_RESULTS)
  return useMemo(
    () => [...results].sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()),
    [results],
  )
}

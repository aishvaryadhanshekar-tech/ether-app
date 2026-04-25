import { useMemo } from "react"
import dayjs from "dayjs"
import { useAppStore } from "@/store/rootStore"
import type { Exam } from "@/modules/exams/types"

const EMPTY_EXAMS: Exam[] = []

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

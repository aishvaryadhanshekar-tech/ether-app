import { useMemo } from "react"
import dayjs from "dayjs"
import { useAppStore } from "@/store/rootStore"
import type { ExamEntry } from "@/modules/exams/types"

const EMPTY_EXAMS: ExamEntry[] = []

export function useExams(childId: string) {
  const exams = useAppStore((state) => state.exams[childId] ?? EMPTY_EXAMS)
  return useMemo(
    () =>
      [...exams].sort(
        (a, b) => dayjs(a.examDate).valueOf() - dayjs(b.examDate).valueOf(),
      ),
    [exams],
  )
}

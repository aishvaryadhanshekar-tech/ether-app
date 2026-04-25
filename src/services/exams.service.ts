import { simulateDelay } from "@/services/delay"
import { useAppStore } from "@/store/rootStore"
import type { Exam, ExamEntry } from "@/modules/exams/types"

type LegacyExamSeedEntry = Omit<Partial<ExamEntry>, "id" | "subject"> &
  Pick<ExamEntry, "id" | "subject">

function normalizeExamEntry(childId: string, entry: LegacyExamSeedEntry): Exam {
  const date = entry.date ?? entry.examDate ?? new Date().toISOString().slice(0, 10)
  return {
    id: entry.id,
    childId: entry.childId ?? childId,
    subject: entry.subject,
    examType: entry.examType ?? "unit_test",
    date,
    examDate: entry.examDate ?? date,
    period: entry.period,
    syllabus: entry.syllabus,
    score: entry.score,
    maxScore: entry.maxScore,
    result: entry.result,
  }
}

export const examsService = {
  async getByChild(childId: string) {
    await simulateDelay()
    return useAppStore.getState().exams[childId] ?? []
  },

  async seed(childId: string, entries: LegacyExamSeedEntry[]) {
    await simulateDelay(50)
    const { exams, upsertExams } = useAppStore.getState()
    if ((exams[childId] ?? []).length > 0) {
      return
    }
    upsertExams(
      childId,
      entries.map((entry) => normalizeExamEntry(childId, entry)),
    )
  },
}

import { simulateDelay } from "@/services/delay"
import { useAppStore } from "@/store/rootStore"
import type { Exam, ExamEntry, ExamResult } from "@/modules/exams/types"

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

function getGradeFromPercentage(percentage: number) {
  if (percentage >= 90) return "A+"
  if (percentage >= 80) return "A"
  if (percentage >= 70) return "B"
  if (percentage >= 60) return "C"
  return "D"
}

function toExamResult(entry: Exam): ExamResult | null {
  if (typeof entry.score !== "number" || typeof entry.maxScore !== "number" || entry.maxScore <= 0) {
    return null
  }

  const percentage = Math.round((entry.score / entry.maxScore) * 100)
  const typeLabel =
    entry.examType === "unit_test" ? "Unit Test" : entry.examType === "practical" ? "Practical" : "Term Exam"

  return {
    id: `result_${entry.id}`,
    childId: entry.childId,
    name: `${entry.subject} ${typeLabel}`,
    date: entry.date,
    percentage,
    grade: getGradeFromPercentage(percentage),
    subjects: [
      {
        subject: entry.subject,
        marks: entry.score,
        maxMarks: entry.maxScore,
        grade: getGradeFromPercentage(percentage),
      },
    ],
  }
}

export const examsService = {
  async getByChild(childId: string) {
    await simulateDelay()
    return useAppStore.getState().exams[childId] ?? []
  },

  async getUpcomingByChild(childId: string) {
    await simulateDelay()
    return useAppStore.getState().exams[childId] ?? []
  },

  async getResultsByChild(childId: string) {
    await simulateDelay()
    return useAppStore.getState().results[childId] ?? []
  },

  async seed(childId: string, entries: LegacyExamSeedEntry[]) {
    await simulateDelay(50)
    const { exams, results, upsertExams, upsertResults } = useAppStore.getState()
    if ((exams[childId] ?? []).length > 0) {
      return
    }
    const normalizedEntries = entries.map((entry) => normalizeExamEntry(childId, entry))
    upsertExams(childId, normalizedEntries)

    if ((results[childId] ?? []).length === 0) {
      const mappedResults = normalizedEntries.map(toExamResult).filter((entry): entry is ExamResult => Boolean(entry))
      upsertResults(childId, mappedResults)
    }
  },
}

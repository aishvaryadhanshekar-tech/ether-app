import { simulateDelay } from "@/services/delay"
import { useAppStore } from "@/store/rootStore"
import type { ExamEntry } from "@/modules/exams/types"

export const examsService = {
  async getByChild(childId: string) {
    await simulateDelay()
    return useAppStore.getState().exams[childId] ?? []
  },

  async seed(childId: string, entries: ExamEntry[]) {
    await simulateDelay(50)
    const { exams, upsertExams } = useAppStore.getState()
    if ((exams[childId] ?? []).length > 0) {
      return
    }
    upsertExams(childId, entries)
  },
}

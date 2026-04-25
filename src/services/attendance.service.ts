import { useAppStore } from "@/store/rootStore"
import { simulateDelay } from "@/services/delay"
import type { AttendanceEntry } from "@/modules/attendance/types"

export const attendanceService = {
  async getMonthly(childId: string, month?: number, year?: number) {
    await simulateDelay()
    const entries = useAppStore.getState().attendance[childId] ?? []
    if (!month || !year) {
      return entries
    }
    const monthPrefix = `${year}-${String(month).padStart(2, "0")}-`
    return entries.filter((entry) => entry.date.startsWith(monthPrefix))
  },

  async addNote(childId: string, date: string, note: string) {
    await simulateDelay()
    useAppStore.getState().updateAttendanceNote(childId, date, note)
  },

  async seed(childId: string, entries: AttendanceEntry[]) {
    await simulateDelay(50)
    const { markAttendance, attendance } = useAppStore.getState()
    if ((attendance[childId] ?? []).length > 0) {
      return
    }
    entries.forEach((entry) => markAttendance(childId, entry))
  },
}

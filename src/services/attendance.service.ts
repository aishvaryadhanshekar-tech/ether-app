import { useAppStore } from "@/store/rootStore"
import { simulateDelay } from "@/services/delay"
import type { AttendanceEntry } from "@/modules/attendance/types"

type LegacyAttendanceSeedEntry = Pick<AttendanceEntry, "date" | "status" | "markedAt" | "note"> &
  Partial<AttendanceEntry>

function normalizeAttendanceEntry(
  childId: string,
  entry: LegacyAttendanceSeedEntry,
): AttendanceEntry {
  const note = entry.absentNote?.note ?? entry.note
  return {
    id: entry.id ?? `att_${childId}_${entry.date}`,
    childId: entry.childId ?? childId,
    date: entry.date,
    status: entry.status,
    markedAt: entry.markedAt,
    periodsPresent: entry.periodsPresent,
    absentNote: note
      ? {
          note,
          submittedAt: entry.absentNote?.submittedAt ?? new Date().toISOString(),
        }
      : undefined,
    isSchoolDay: entry.isSchoolDay ?? !["holiday", "weekend"].includes(entry.status),
    note,
  }
}

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

  async seed(childId: string, entries: LegacyAttendanceSeedEntry[]) {
    await simulateDelay(50)
    const { markAttendance, attendance } = useAppStore.getState()
    if ((attendance[childId] ?? []).length > 0) {
      return
    }
    entries.forEach((entry) => markAttendance(childId, normalizeAttendanceEntry(childId, entry)))
  },
}

import type { StateCreator } from "zustand"
import type { AttendanceByChild, AttendanceEntry } from "@/modules/attendance/types"
import type { AppStore } from "@/store/rootStore"

export interface AttendanceSlice {
  attendance: AttendanceByChild
  markAttendance: (childId: string, entry: AttendanceEntry) => void
  updateAttendanceNote: (childId: string, date: string, note: string) => void
}

export const createAttendanceSlice: StateCreator<
  AppStore,
  [],
  [],
  AttendanceSlice
> = (set, get) => ({
  attendance: {},
  markAttendance: (childId, entry) => {
    const current = get().attendance[childId] ?? []
    set({
      attendance: {
        ...get().attendance,
        [childId]: [...current, entry],
      },
    })
  },
  updateAttendanceNote: (childId, date, note) => {
    const entries = get().attendance[childId] ?? []
    const submittedAt = new Date().toISOString()
    set({
      attendance: {
        ...get().attendance,
        [childId]: entries.map((entry) =>
          entry.date === date
            ? {
                ...entry,
                note,
                absentNote: {
                  note,
                  submittedAt,
                },
              }
            : entry,
        ),
      },
    })
  },
})

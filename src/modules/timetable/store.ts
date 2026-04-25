import type { StateCreator } from "zustand"
import type { TimetableWeek } from "@/modules/timetable/types"
import type { AppStore } from "@/store/rootStore"

export interface TimetableSlice {
  timetable: Record<string, TimetableWeek>
  upsertTimetableWeek: (childId: string, week: TimetableWeek) => void
}

export const createTimetableSlice: StateCreator<
  AppStore,
  [],
  [],
  TimetableSlice
> = (set, get) => ({
  timetable: {},
  upsertTimetableWeek: (childId, week) => {
    set({
      timetable: {
        ...get().timetable,
        [childId]: week,
      },
    })
  },
})

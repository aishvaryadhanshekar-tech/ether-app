import type { TimetableDayName } from "@/modules/timetable/types"
import { useAppStore } from "@/store/rootStore"

export function useTimetableWeek(childId: string) {
  return useAppStore((state) => state.timetable[childId])
}

export function useTimetableDay(childId: string, day: TimetableDayName) {
  return useAppStore((state) => state.timetable[childId]?.days.find((entry) => entry.day === day))
}

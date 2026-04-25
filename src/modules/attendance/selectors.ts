import { useMemo } from "react"
import dayjs from "dayjs"
import { useAppStore } from "@/store/rootStore"
import { sortByDateDescending } from "@/modules/attendance/utils"
import type {
  AttendanceEntry,
  AttendanceStatus,
  CalendarCellData,
  CalendarMatrix,
} from "@/modules/attendance/types"

const EMPTY_ATTENDANCE_ENTRIES: AttendanceEntry[] = []

export function useAttendanceEntries(childId: string) {
  const entries = useAppStore(
    (state) => state.attendance[childId] ?? EMPTY_ATTENDANCE_ENTRIES,
  )
  return useMemo(() => sortByDateDescending(entries), [entries])
}

export function getCalendarMatrix(
  entries: AttendanceEntry[],
  month: number,
  year: number,
): CalendarMatrix {
  const start = dayjs(`${year}-${String(month).padStart(2, "0")}-01`)
  const end = start.endOf("month")
  const today = dayjs()
  const entryByDate = Object.fromEntries(entries.map((entry) => [entry.date, entry]))

  const days: dayjs.Dayjs[] = []
  let current = start

  while (current.isBefore(end) || current.isSame(end, "day")) {
    const day = current.day()
    if (day !== 0 && day !== 6) {
      days.push(current)
    }
    current = current.add(1, "day")
  }

  const rows: dayjs.Dayjs[][] = []
  for (let i = 0; i < days.length; i += 5) {
    rows.push(days.slice(i, i + 5))
  }

  return rows.map((row) =>
    row.map((day): CalendarCellData => {
      const date = day.format("YYYY-MM-DD")
      const entry = entryByDate[date]
      const status: AttendanceStatus = entry?.status ?? "not_marked"
      const isFuture = day.isAfter(today, "day")

      return {
        date,
        dayNumber: day.date(),
        status,
        isCurrentMonth: true,
        isToday: day.isSame(today, "day"),
        isDisabled: status === "holiday" || isFuture,
      }
    }),
  )
}

export function useCalendarMatrix(childId: string, month: number, year: number) {
  const entries = useAttendanceEntries(childId)
  return useMemo(() => getCalendarMatrix(entries, month, year), [entries, month, year])
}

export function getSummary(entries: AttendanceEntry[]) {
  return {
    present: entries.filter((entry) => entry.status === "present").length,
    absent: entries.filter((entry) => entry.status === "absent").length,
    late: entries.filter((entry) => entry.status === "late").length,
  }
}

export function useAttendanceSummary(childId: string) {
  const entries = useAttendanceEntries(childId)
  return useMemo(() => getSummary(entries), [entries])
}

export function getAnomalies(entries: AttendanceEntry[]) {
  return entries
    .filter((entry) => entry.status === "absent" || entry.status === "late")
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)
}

export function useAttendanceAnomalies(childId: string) {
  const entries = useAttendanceEntries(childId)
  return useMemo(() => getAnomalies(entries), [entries])
}

import { useMemo } from "react"
import dayjs from "dayjs"
import { useAppStore } from "@/store/rootStore"
import { sortByDateDescending } from "@/modules/attendance/utils"
import type {
  AttendanceAnomaly,
  AttendanceEntry,
  AttendanceSummary,
  AttendanceStatus,
  CalendarCellData,
  CalendarMatrix,
} from "@/modules/attendance/types"

const EMPTY_ATTENDANCE_ENTRIES: AttendanceEntry[] = []
const MAX_ANOMALIES = 5

function isAnomalyStatus(status: AttendanceStatus): status is "absent" | "late" {
  return status === "absent" || status === "late"
}

export function useAttendanceEntries(childId: string) {
  const entries = useAppStore(
    (state) => state.attendance[childId] ?? EMPTY_ATTENDANCE_ENTRIES,
  )
  return useMemo(() => sortByDateDescending(entries), [entries])
}

export function getMonthlyAttendanceEntries(
  entries: AttendanceEntry[],
  month: number,
  year: number,
) {
  const prefix = `${year}-${String(month).padStart(2, "0")}-`
  return entries.filter((entry) => entry.date.startsWith(prefix))
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
  const startOffset = (start.day() + 6) % 7
  let current = start.subtract(startOffset, "day")

  while (current.isBefore(end) || current.isSame(end, "day") || days.length % 7 !== 0) {
    days.push(current)
    current = current.add(1, "day")
  }

  const rows: dayjs.Dayjs[][] = []
  for (let i = 0; i < days.length; i += 7) {
    rows.push(days.slice(i, i + 7))
  }

  return rows.map((row) =>
    row.map((day): CalendarCellData => {
      const date = day.format("YYYY-MM-DD")
      const entry = entryByDate[date]
      const dayOfWeek = day.day()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const isCurrentMonth = day.month() === start.month() && day.year() === start.year()
      const status: AttendanceStatus = !isCurrentMonth
        ? "not_marked"
        : isWeekend
          ? "weekend"
          : !entry
            ? "not_marked"
            : entry.status === "present" || entry.status === "late" || entry.status === "absent"
              ? entry.status
              : entry.status === "holiday" || entry.isSchoolDay === false
                ? "holiday"
                : "not_marked"
      const isFuture = day.isAfter(today, "day")

      return {
        date,
        dayNumber: day.date(),
        status,
        isCurrentMonth,
        isToday: day.isSame(today, "day"),
        isDisabled: !isCurrentMonth || status === "holiday" || status === "weekend" || isFuture,
      }
    }),
  )
}

export function useCalendarMatrix(childId: string, month: number, year: number) {
  const entries = useAttendanceEntries(childId)
  return useMemo(() => getCalendarMatrix(entries, month, year), [entries, month, year])
}

export function getSummary(entries: AttendanceEntry[]): AttendanceSummary {
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

export function getAnomalies(entries: AttendanceEntry[]): AttendanceAnomaly[] {
  const anomalies = entries
    .filter((entry) => isAnomalyStatus(entry.status))
    .map((entry) => {
      const status: "absent" | "late" = entry.status === "absent" ? "absent" : "late"
      const hasNote = Boolean((entry.absentNote?.note ?? entry.note)?.trim())
      return {
        date: entry.date,
        status,
        reason: entry.absentNote?.note ?? entry.note,
        hasNote,
        needsAction: status === "absent" && !hasNote,
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))

  const unresolved = anomalies.filter((entry) => entry.needsAction)
  const resolved = anomalies.filter((entry) => !entry.needsAction)
  const remainingSlots = Math.max(0, MAX_ANOMALIES - unresolved.length)

  return [...unresolved, ...resolved.slice(0, remainingSlots)]
}

export function useAttendanceAnomalies(childId: string) {
  const entries = useAttendanceEntries(childId)
  return useMemo(() => getAnomalies(entries), [entries])
}

import { useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
import { AttendanceAnomalies } from "@/modules/attendance/components/AttendanceAnomalies"
import { AttendanceBottomSheet } from "@/modules/attendance/components/AttendanceBottomSheet"
import { AttendanceCalendar } from "@/modules/attendance/components/AttendanceCalendar"
import { AttendanceHeader } from "@/modules/attendance/components/AttendanceHeader"
import { AttendanceSummary } from "@/modules/attendance/components/AttendanceSummary"
import {
  getAnomalies,
  getMonthlyAttendanceEntries,
  getSummary,
  useAttendanceEntries,
  useCalendarMatrix,
} from "@/modules/attendance/selectors"
import { attendanceService } from "@/services/attendance.service"
import type { CalendarCellData } from "@/modules/attendance/types"

interface AttendanceSectionProps {
  childId: string
}

export function AttendanceSection({ childId }: AttendanceSectionProps) {
  const today = dayjs()
  const [month, setMonth] = useState(today.month() + 1)
  const [year, setYear] = useState(today.year())
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [note, setNote] = useState("")

  const entries = useAttendanceEntries(childId)
  const matrix = useCalendarMatrix(childId, month, year)
  const monthlyEntries = useMemo(
    () => getMonthlyAttendanceEntries(entries, month, year),
    [entries, month, year],
  )
  const summary = useMemo(() => getSummary(monthlyEntries), [monthlyEntries])
  const anomalies = useMemo(() => getAnomalies(monthlyEntries), [monthlyEntries])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await attendanceService.getMonthly(childId, month, year)
      setLoading(false)
    }
    void load()
  }, [childId, month, year])

  const entryByDate = useMemo(
    () => Object.fromEntries(entries.map((entry) => [entry.date, entry])),
    [entries],
  )
  const selectedEntry = selectedDate ? entryByDate[selectedDate] : undefined

  function handlePreviousMonth() {
    const previous = dayjs(`${year}-${String(month).padStart(2, "0")}-01`).subtract(1, "month")
    setMonth(previous.month() + 1)
    setYear(previous.year())
  }

  function handleNextMonth() {
    const next = dayjs(`${year}-${String(month).padStart(2, "0")}-01`).add(1, "month")
    setMonth(next.month() + 1)
    setYear(next.year())
  }

  function handleCellClick(cell: CalendarCellData) {
    if (cell.isDisabled) {
      return
    }
    setSelectedDate(cell.date)
    setBottomSheetOpen(true)
  }

  function handleBottomSheetOpenChange(open: boolean) {
    setBottomSheetOpen(open)
    if (!open) {
      setNote("")
    }
  }

  async function handleSubmitNote() {
    if (!selectedDate || !note.trim()) {
      return
    }
    await attendanceService.addNote(childId, selectedDate, note.trim())
    setNote("")
  }

  return (
    <section>
      <AttendanceHeader
        month={month}
        year={year}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />
      {loading ? <p className="mb-3 text-sm text-muted">Loading attendance...</p> : null}

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div>
          <AttendanceCalendar matrix={matrix} onCellClick={handleCellClick} />
          <AttendanceBottomSheet
            isOpen={isBottomSheetOpen}
            onOpenChange={handleBottomSheetOpenChange}
            selectedDate={selectedDate}
            entry={selectedEntry}
            note={note}
            onChangeNote={setNote}
            onSubmitNote={handleSubmitNote}
          />
        </div>

        <div className="space-y-4">
          <AttendanceSummary summary={summary} />
          <AttendanceAnomalies anomalies={anomalies} />
        </div>
      </div>
    </section>
  )
}

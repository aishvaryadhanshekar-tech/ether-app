import { Card } from "@/design-system/components/Card"
import { CalendarGrid } from "@/modules/attendance/components/CalendarGrid"
import type { CalendarCellData, CalendarMatrix } from "@/modules/attendance/types"

interface AttendanceCalendarProps {
  matrix: CalendarMatrix
  onCellClick: (cell: CalendarCellData) => void
}

export function AttendanceCalendar({ matrix, onCellClick }: AttendanceCalendarProps) {
  return (
    <Card>
      <div className="mb-3 grid grid-cols-5 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-muted">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
      </div>
      <CalendarGrid matrix={matrix} onCellClick={onCellClick} />
    </Card>
  )
}

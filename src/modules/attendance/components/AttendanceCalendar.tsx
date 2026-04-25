import { CalendarGrid } from "@/modules/attendance/components/CalendarGrid"
import type { CalendarCellData, CalendarMatrix } from "@/modules/attendance/types"

interface AttendanceCalendarProps {
  matrix: CalendarMatrix
  onCellClick: (cell: CalendarCellData) => void
}

export function AttendanceCalendar({ matrix, onCellClick }: AttendanceCalendarProps) {
  const dayHeaders = ["M", "T", "W", "T", "F", "S", "S"] as const

  return (
    <div className="attendance-calendar">
      <div className="attendance-calendar-day-header-row">
        {dayHeaders.map((label, index) => (
          <span key={`${label}-${index}`} className="attendance-calendar-day-header">
            {label}
          </span>
        ))}
      </div>
      <CalendarGrid matrix={matrix} onCellClick={onCellClick} />
    </div>
  )
}

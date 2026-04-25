import { Card } from "@/design-system/components/Card"
import { CalendarGrid } from "@/modules/attendance/components/CalendarGrid"
import type { CalendarCellData, CalendarMatrix } from "@/modules/attendance/types"

interface AttendanceCalendarProps {
  matrix: CalendarMatrix
  onCellClick: (cell: CalendarCellData) => void
}

export function AttendanceCalendar({ matrix, onCellClick }: AttendanceCalendarProps) {
  const dayHeaders = ["M", "T", "W", "T", "F", "S", "S"] as const

  return (
    <Card>
      <div className="mb-3 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-muted">
        {dayHeaders.map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>
      <CalendarGrid matrix={matrix} onCellClick={onCellClick} />
    </Card>
  )
}

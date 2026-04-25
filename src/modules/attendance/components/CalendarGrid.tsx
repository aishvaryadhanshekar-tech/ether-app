import { CalendarRow } from "@/modules/attendance/components/CalendarRow"
import type { CalendarCellData, CalendarMatrix } from "@/modules/attendance/types"

interface CalendarGridProps {
  matrix: CalendarMatrix
  onCellClick: (cell: CalendarCellData) => void
}

export function CalendarGrid({ matrix, onCellClick }: CalendarGridProps) {
  return (
    <div className="calendar-grid">
      {matrix.map((row, index) => (
        <CalendarRow key={`calendar-row-${index}`} row={row} onCellClick={onCellClick} />
      ))}
    </div>
  )
}

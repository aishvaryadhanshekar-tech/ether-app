import { CalendarCell } from "@/modules/attendance/components/CalendarCell"
import type { CalendarCellData } from "@/modules/attendance/types"

interface CalendarRowProps {
  row: CalendarCellData[]
  onCellClick: (cell: CalendarCellData) => void
}

export function CalendarRow({ row, onCellClick }: CalendarRowProps) {
  return (
    <div className="calendar-row">
      {row.map((cell) => (
        <CalendarCell key={cell.date} cell={cell} onClick={onCellClick} />
      ))}
    </div>
  )
}

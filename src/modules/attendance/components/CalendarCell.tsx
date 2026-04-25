import { cn } from "@/lib/utils"
import type { CalendarCellData } from "@/modules/attendance/types"

interface CalendarCellProps {
  cell: CalendarCellData
  onClick: (cell: CalendarCellData) => void
}

const statusStyles: Record<CalendarCellData["status"], string> = {
  present: "bg-green-100 text-green-700",
  absent: "bg-red-100 text-red-700",
  late: "bg-amber-100 text-amber-700",
  not_marked: "bg-amber-50 text-amber-700",
  holiday: "bg-slate-100 text-slate-400",
}

const statusIcon: Record<CalendarCellData["status"], string> = {
  present: "P",
  absent: "A",
  late: "L",
  not_marked: "NM",
  holiday: "H",
}

export function CalendarCell({ cell, onClick }: CalendarCellProps) {
  return (
    <button
      type="button"
      disabled={cell.isDisabled}
      className={cn(
        "flex h-16 w-full flex-col items-center justify-center rounded-lg text-sm font-medium transition",
        statusStyles[cell.status],
        cell.isToday && "ring-2 ring-primary/50",
        cell.isDisabled && "cursor-not-allowed opacity-50",
      )}
      onClick={() => onClick(cell)}
    >
      <span>{cell.dayNumber}</span>
      <span className="text-[10px] font-semibold">{statusIcon[cell.status]}</span>
    </button>
  )
}

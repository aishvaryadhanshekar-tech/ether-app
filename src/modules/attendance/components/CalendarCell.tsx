import { Check, CircleDot, XCircle, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CalendarCellData } from "@/modules/attendance/types"

interface CalendarCellProps {
  cell: CalendarCellData
  onClick: (cell: CalendarCellData) => void
}

interface StatusConfig {
  icon: LucideIcon | null
  iconClassName: string
  modifierClassName: string
  dayNumberClassName: string
}

const statusConfig: Record<CalendarCellData["status"], StatusConfig> = {
  present: {
    icon: Check,
    iconClassName: "calendar-cell-icon-present",
    modifierClassName: "calendar-cell-status-present",
    dayNumberClassName: "calendar-cell-day-present",
  },
  absent: {
    icon: XCircle,
    iconClassName: "calendar-cell-icon-absent",
    modifierClassName: "calendar-cell-status-absent",
    dayNumberClassName: "calendar-cell-day-absent",
  },
  late: {
    icon: CircleDot,
    iconClassName: "calendar-cell-icon-late",
    modifierClassName: "calendar-cell-status-late",
    dayNumberClassName: "calendar-cell-day-late",
  },
  not_marked: {
    icon: null,
    iconClassName: "calendar-cell-icon-muted",
    modifierClassName: "calendar-cell-status-none",
    dayNumberClassName: "calendar-cell-day-muted",
  },
  holiday: {
    icon: null,
    iconClassName: "calendar-cell-icon-subtle",
    modifierClassName: "calendar-cell-status-none",
    dayNumberClassName: "calendar-cell-day-subtle",
  },
  weekend: {
    icon: null,
    iconClassName: "calendar-cell-icon-subtle",
    modifierClassName: "calendar-cell-status-none",
    dayNumberClassName: "calendar-cell-day-subtle",
  },
}

export function CalendarCell({ cell, onClick }: CalendarCellProps) {
  const config = statusConfig[cell.status]
  const Icon = cell.isCurrentMonth ? config.icon : null

  return (
    <button
      type="button"
      disabled={cell.isDisabled}
      data-current-month={cell.isCurrentMonth ? "true" : "false"}
      data-today={cell.isToday ? "true" : "false"}
      className={cn(
        "calendar-cell-button",
        config.modifierClassName,
        !cell.isCurrentMonth && "calendar-cell-outside-month",
        cell.isToday && "calendar-cell-today",
        cell.isDisabled && "calendar-cell-disabled",
      )}
      onClick={() => onClick(cell)}
    >
      <span className={cn("calendar-cell-day", config.dayNumberClassName)}>
        {cell.isCurrentMonth ? cell.dayNumber : ""}
      </span>
      {Icon ? <Icon className={cn("calendar-cell-icon", config.iconClassName)} /> : null}
    </button>
  )
}

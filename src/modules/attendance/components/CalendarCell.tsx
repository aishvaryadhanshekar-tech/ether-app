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
  containerClassName: string
  dayNumberClassName: string
}

const statusConfig: Record<CalendarCellData["status"], StatusConfig> = {
  present: {
    icon: Check,
    iconClassName: "text-green-600",
    containerClassName: "bg-green-50",
    dayNumberClassName: "text-green-900",
  },
  absent: {
    icon: XCircle,
    iconClassName: "text-red-600",
    containerClassName: "bg-red-50",
    dayNumberClassName: "text-red-900",
  },
  late: {
    icon: CircleDot,
    iconClassName: "text-amber-500",
    containerClassName: "bg-amber-50",
    dayNumberClassName: "text-amber-900",
  },
  not_marked: {
    icon: null,
    iconClassName: "text-gray-400",
    containerClassName: "bg-slate-50",
    dayNumberClassName: "text-slate-700",
  },
  holiday: {
    icon: null,
    iconClassName: "text-gray-300",
    containerClassName: "bg-slate-100",
    dayNumberClassName: "text-slate-400",
  },
  weekend: {
    icon: null,
    iconClassName: "text-gray-300",
    containerClassName: "bg-slate-100",
    dayNumberClassName: "text-slate-400",
  },
}

export function CalendarCell({ cell, onClick }: CalendarCellProps) {
  const config = statusConfig[cell.status]
  const Icon = cell.isCurrentMonth ? config.icon : null

  return (
    <button
      type="button"
      disabled={cell.isDisabled}
      className={cn(
        "flex h-20 w-full flex-col items-center justify-center gap-2 rounded-2xl bg-white p-2 text-sm font-medium shadow-sm transition active:scale-95",
        config.containerClassName,
        !cell.isCurrentMonth && "opacity-35",
        cell.isToday && "border border-primary",
        cell.isDisabled && "cursor-not-allowed opacity-60 active:scale-100",
      )}
      onClick={() => onClick(cell)}
    >
      <span className={cn("text-sm", config.dayNumberClassName)}>
        {cell.isCurrentMonth ? cell.dayNumber : ""}
      </span>
      {Icon ? <Icon className={cn("h-4 w-4", config.iconClassName)} /> : null}
    </button>
  )
}

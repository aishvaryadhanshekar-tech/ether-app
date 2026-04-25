import dayjs from "dayjs"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/design-system/components/Button"

interface AttendanceHeaderProps {
  month: number
  year: number
  onPreviousMonth: () => void
  onNextMonth: () => void
}

export function AttendanceHeader({
  month,
  year,
  onPreviousMonth,
  onNextMonth,
}: AttendanceHeaderProps) {
  const label = dayjs(`${year}-${String(month).padStart(2, "0")}-01`).format("MMMM YYYY")

  return (
    <header className="attendance-header">
      <div>
        <h3 className="attendance-header-title">Attendance Calendar</h3>
      </div>
      <div className="attendance-header-row">
        <div className="attendance-header-nav-cell attendance-header-nav-cell-left">
          <Button type="button" variant="ghost" onClick={onPreviousMonth} aria-label="Previous month">
            <ChevronLeft className="attendance-header-icon" />
          </Button>
        </div>
        <p className="attendance-header-month">{label}</p>
        <div className="attendance-header-nav-cell attendance-header-nav-cell-right">
          <Button type="button" variant="ghost" onClick={onNextMonth} aria-label="Next month">
            <ChevronRight className="attendance-header-icon" />
          </Button>
        </div>
      </div>
    </header>
  )
}

import dayjs from "dayjs"
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
    <header className="mb-4 flex items-center justify-between gap-2">
      <div>
        <h3 className="text-base font-semibold text-foreground">Attendance Calendar</h3>
        <p className="text-sm text-muted">{label}</p>
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={onPreviousMonth}>
          Prev
        </Button>
        <Button type="button" variant="ghost" onClick={onNextMonth}>
          Next
        </Button>
      </div>
    </header>
  )
}

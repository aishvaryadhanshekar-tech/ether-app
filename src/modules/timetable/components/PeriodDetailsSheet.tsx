import { Button } from "@/design-system/components/Button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import type { Period } from "@/modules/timetable/types"

interface PeriodDetailsSheetProps {
  period: Period | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function PeriodDetailsSheet({ period, isOpen, onOpenChange }: PeriodDetailsSheetProps) {
  if (!period) {
    return null
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <div className="attendance-sheet-grabber" />
        <div className="attendance-sheet-body">
          <h3 className="attendance-sheet-title">Class Details</h3>
          <div className="attendance-sheet-data-card">
            <p className="attendance-sheet-label">Subject</p>
            <p className="attendance-sheet-value">{period.subject}</p>
          </div>
          <div className="attendance-sheet-data-card">
            <p className="attendance-sheet-label">Teacher</p>
            <p className="attendance-sheet-value">{period.teacher}</p>
          </div>
          <div className="attendance-sheet-data-card">
            <p className="attendance-sheet-label">Time</p>
            <p className="attendance-sheet-value">
              {period.startTime} - {period.endTime}
            </p>
          </div>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

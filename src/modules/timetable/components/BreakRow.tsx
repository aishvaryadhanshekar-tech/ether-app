import type { Period } from "@/modules/timetable/types"

interface BreakRowProps {
  period: Period
}

export function BreakRow({ period }: BreakRowProps) {
  return (
    <div className="timetable-break-row">
      <p className="timetable-break-label">
        --- {period.subject} ({period.startTime} - {period.endTime}) ---
      </p>
    </div>
  )
}

import type { Period } from "@/modules/timetable/types"

interface PeriodCardProps {
  period: Period
  isCurrent?: boolean
  onSelectPeriod: (period: Period) => void
}

export function PeriodCard({ period, isCurrent = false, onSelectPeriod }: PeriodCardProps) {
  return (
    <button
      type="button"
      className="timetable-period-row"
      data-current={isCurrent ? "true" : "false"}
      onClick={() => onSelectPeriod(period)}
      aria-label={`${period.subject} with ${period.teacher} from ${period.startTime} to ${period.endTime}`}
    >
      <div className="timetable-period-time-column">
        <p className="timetable-period-time-start">{period.startTime}</p>
        <p className="timetable-period-time-end">{period.endTime}</p>
      </div>
      <div className="timetable-period-content">
        <div className="timetable-period-subject-row">
          <p className="timetable-period-subject">{period.subject}</p>
          {isCurrent ? <span className="timetable-period-now-tag">Now</span> : null}
        </div>
        <p className="timetable-period-teacher">{period.teacher}</p>
      </div>
    </button>
  )
}

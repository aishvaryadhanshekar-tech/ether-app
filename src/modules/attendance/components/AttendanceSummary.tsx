interface AttendanceSummaryProps {
  summary: {
    present: number
    absent: number
    late: number
  }
}

export function AttendanceSummary({ summary }: AttendanceSummaryProps) {
  const total = summary.present + summary.absent + summary.late
  const presentPercent = total === 0 ? 0 : Math.round((summary.present / total) * 100)
  const absentPercent = total === 0 ? 0 : Math.round((summary.absent / total) * 100)
  const latePercent = total === 0 ? 0 : Math.max(0, 100 - presentPercent - absentPercent)

  return (
    <div className="attendance-summary">
      <h4 className="attendance-summary-title">Attendance Summary</h4>
      <div className="attendance-summary-chips">
        <span className="attendance-summary-chip">
          {summary.absent} Absent ({absentPercent}%)
        </span>
        <span className="attendance-summary-chip">
          {summary.late} Late ({latePercent}%)
        </span>
        <span className="attendance-summary-chip">
          {summary.present} Present ({presentPercent}%)
        </span>
      </div>
      <div className="attendance-summary-progress" aria-hidden="true">
        <span className="attendance-summary-progress-segment attendance-summary-progress-absent" style={{ width: `${absentPercent}%` }} />
        <span className="attendance-summary-progress-segment attendance-summary-progress-late" style={{ width: `${latePercent}%` }} />
        <span className="attendance-summary-progress-segment attendance-summary-progress-present" style={{ width: `${presentPercent}%` }} />
      </div>
    </div>
  )
}

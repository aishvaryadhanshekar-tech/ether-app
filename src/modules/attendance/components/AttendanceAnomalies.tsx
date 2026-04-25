import dayjs from "dayjs"
import type { AttendanceAnomaly } from "@/modules/attendance/types"

interface AttendanceAnomaliesProps {
  anomalies: AttendanceAnomaly[]
  onAddNote: (date: string) => void
}

function formatDisplayDate(date: string) {
  const parsed = dayjs(date)
  return parsed.isValid() ? parsed.format("MMM D") : date
}

export function AttendanceAnomalies({ anomalies, onAddNote }: AttendanceAnomaliesProps) {
  function renderItem(entry: AttendanceAnomaly) {
    const statusLabel = entry.status === "absent" ? "Absent" : "Late"

    return (
      <li key={`anomaly-${entry.date}`} className="attendance-anomalies-item">
        <div className="attendance-anomalies-item-left">
          <span className="attendance-anomalies-date">{formatDisplayDate(entry.date)}</span>
          <span className="attendance-anomalies-status">{statusLabel}</span>
        </div>
        <div className="attendance-anomalies-item-right">
          {entry.needsAction ? (
            <>
              <span className="attendance-anomalies-action-note">No note submitted</span>
              <button
                type="button"
                className="attendance-anomalies-action-link"
                onClick={() => onAddNote(entry.date)}
              >
                Add Note
              </button>
            </>
          ) : entry.status === "absent" ? (
            <span className="attendance-anomalies-action-success">Note submitted</span>
          ) : (
            <span className="attendance-anomalies-action-info">Arrived late</span>
          )}
        </div>
      </li>
    )
  }

  return (
    <section className="attendance-anomalies">
      <h4 className="attendance-anomalies-title">Recent Anomalies</h4>
      {anomalies.length === 0 ? (
        <p className="attendance-anomalies-empty">No recent late or absent records.</p>
      ) : (
        <ul className="attendance-anomalies-list">{anomalies.map((entry) => renderItem(entry))}</ul>
      )}
    </section>
  )
}

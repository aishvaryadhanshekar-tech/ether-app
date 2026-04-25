import { Card } from "@/design-system/components/Card"
import type { AttendanceEntry } from "@/modules/attendance/types"

interface AttendanceAnomaliesProps {
  anomalies: AttendanceEntry[]
}

export function AttendanceAnomalies({ anomalies }: AttendanceAnomaliesProps) {
  return (
    <Card>
      <h4 className="mb-3 text-sm font-semibold text-foreground">Recent Anomalies</h4>
      {anomalies.length === 0 ? (
        <p className="text-sm text-muted">No recent late or absent records.</p>
      ) : (
        <ul className="space-y-2">
          {anomalies.map((entry) => (
            <li
              key={`anomaly-${entry.date}`}
              className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
            >
              <span className="font-medium text-foreground">{entry.date}</span>
              <span className="capitalize text-muted">{entry.status}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

import { Card } from "@/design-system/components/Card"

interface AttendanceSummaryProps {
  summary: {
    present: number
    absent: number
    late: number
  }
}

export function AttendanceSummary({ summary }: AttendanceSummaryProps) {
  return (
    <Card>
      <h4 className="mb-3 text-sm font-semibold text-foreground">Attendance Summary</h4>
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-lg bg-green-50 p-2">
          <p className="font-semibold text-green-700">{summary.present}</p>
          <p className="text-xs text-green-700">Present</p>
        </div>
        <div className="rounded-lg bg-red-50 p-2">
          <p className="font-semibold text-red-700">{summary.absent}</p>
          <p className="text-xs text-red-700">Absent</p>
        </div>
        <div className="rounded-lg bg-amber-50 p-2">
          <p className="font-semibold text-amber-700">{summary.late}</p>
          <p className="text-xs text-amber-700">Late</p>
        </div>
      </div>
    </Card>
  )
}

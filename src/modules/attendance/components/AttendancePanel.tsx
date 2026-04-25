import { AttendanceSection } from "@/modules/attendance/components/AttendanceSection"

interface AttendancePanelProps {
  childId: string
}

export function AttendancePanel({ childId }: AttendancePanelProps) {
  return <AttendanceSection childId={childId} />
}

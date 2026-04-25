import { AttendancePanel } from "@/modules/attendance/components/AttendancePanel"

interface AttendanceScreenProps {
  childId: string
}

export function AttendanceScreen({ childId }: AttendanceScreenProps) {
  return <AttendancePanel childId={childId} />
}

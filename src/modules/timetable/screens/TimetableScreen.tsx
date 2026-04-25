import { TimetableSection } from "@/modules/timetable/components/TimetableSection"
import { useActiveChild } from "@/shared/hooks/useActiveChild"

export function TimetableScreen() {
  const { activeChildId } = useActiveChild()

  return <TimetableSection childId={activeChildId} />
}

import { useMemo } from "react"
import { SectionTabs, type ChildTab } from "@/modules/child/components/SectionTabs"
import { AttendancePanel } from "@/modules/attendance/components/AttendancePanel"
import { ExamsPanel } from "@/modules/exams/components/ExamsPanel"
import { TimetableScreen } from "@/modules/timetable/screens/TimetableScreen"
import { BadgesScreen } from "@/modules/badges/screens/BadgesScreen"
import { LearnScreen } from "@/modules/learn/screens/LearnScreen"
import { PageTitle } from "@/shared/components/PageTitle"
import { useActiveChild } from "@/shared/hooks/useActiveChild"

interface MyChildScreenProps {
  initialTab?: ChildTab
}

export function MyChildScreen({ initialTab = "attendance" }: MyChildScreenProps) {
  const { activeChildId } = useActiveChild()

  const content = useMemo(() => {
    switch (initialTab) {
      case "attendance":
        return <AttendancePanel childId={activeChildId} />
      case "exams":
        return <ExamsPanel childId={activeChildId} />
      case "timetable":
        return <TimetableScreen />
      case "badges":
        return <BadgesScreen childId={activeChildId} />
      case "learn":
        return <LearnScreen />
      default:
        return <AttendancePanel childId={activeChildId} />
    }
  }, [activeChildId, initialTab])

  return (
    <section>
      <PageTitle>My Child</PageTitle>
      <SectionTabs activeTab={initialTab} />
      {content}
    </section>
  )
}

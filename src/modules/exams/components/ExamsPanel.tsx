import { useEffect, useState } from "react"
import { ExamDetailsSheet } from "@/modules/exams/components/ExamDetailsSheet"
import { UpcomingList } from "@/modules/exams/components/UpcomingList"
import { useUpcomingExams } from "@/modules/exams/selectors"
import { examsService } from "@/services/exams.service"
import type { UpcomingExam } from "@/modules/exams/types"

interface ExamsPanelProps {
  childId: string
}

export function ExamsPanel({ childId }: ExamsPanelProps) {
  const upcoming = useUpcomingExams(childId)
  const [loading, setLoading] = useState(false)
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [selectedUpcoming, setSelectedUpcoming] = useState<UpcomingExam | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await examsService.getUpcomingByChild(childId)
      setLoading(false)
    }
    void load()
  }, [childId])

  function handleSelectUpcoming(exam: UpcomingExam) {
    setSelectedUpcoming(exam)
    setSheetOpen(true)
  }

  return (
    <section className="exams-section">
      <div className="exams-text-switcher">
        <span className="exams-text-switcher-item" data-active="true">
          Upcoming
        </span>
        <span className="exams-text-switcher-item" data-active="false">
          Results
        </span>
      </div>
      {loading ? <p className="screen-card-copy">Loading...</p> : null}
      <UpcomingList exams={upcoming} onSelectExam={handleSelectUpcoming} />
      <ExamDetailsSheet
        mode="upcoming"
        selectedUpcoming={selectedUpcoming}
        selectedResult={null}
        isOpen={isSheetOpen}
        onOpenChange={setSheetOpen}
      />
    </section>
  )
}

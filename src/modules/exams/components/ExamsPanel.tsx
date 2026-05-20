import { useEffect, useState } from "react"
import { DaySelector } from "@/modules/timetable/components/DaySelector"
import { ExamDetailsSheet } from "@/modules/exams/components/ExamDetailsSheet"
import { ResultsList } from "@/modules/exams/components/ResultsList"
import { UpcomingList } from "@/modules/exams/components/UpcomingList"
import { useExamResults, useUpcomingExams } from "@/modules/exams/selectors"
import { examsService } from "@/services/exams.service"
import type { ExamResult, UpcomingExam } from "@/modules/exams/types"

interface ExamsPanelProps {
  childId: string
}

type ExamsMode = "upcoming" | "results"

const examModeItems: Array<{ value: ExamsMode; label: string }> = [
  { value: "upcoming", label: "Schedule" },
  { value: "results", label: "Results" },
]

export function ExamsPanel({ childId }: ExamsPanelProps) {
  const upcoming = useUpcomingExams(childId)
  const results = useExamResults(childId)
  const [mode, setMode] = useState<ExamsMode>("upcoming")
  const [loading, setLoading] = useState(false)
  const [selectedUpcoming, setSelectedUpcoming] = useState<UpcomingExam | null>(null)
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await Promise.all([examsService.getUpcomingByChild(childId), examsService.getResultsByChild(childId)])
      setLoading(false)
    }
    void load()
  }, [childId])

  function handleModeChange(nextMode: ExamsMode) {
    setMode(nextMode)
    setSelectedUpcoming(null)
    setSelectedResult(null)
  }

  function handleSelectUpcoming(exam: UpcomingExam) {
    setSelectedUpcoming(exam)
    setSelectedResult(null)
  }

  function handleSelectResult(result: ExamResult) {
    setSelectedResult(result)
    setSelectedUpcoming(null)
  }

  function handleSheetOpenChange(open: boolean) {
    if (!open) {
      setSelectedUpcoming(null)
      setSelectedResult(null)
    }
  }

  return (
    <section className="exams-section">
      <DaySelector<ExamsMode>
        selectedValue={mode}
        onSelectValue={handleModeChange}
        items={examModeItems}
        ariaLabel="Exams mode filter"
        variant="underline"
      />
      {loading ? <p className="screen-card-copy">Loading...</p> : null}
      {mode === "upcoming" ? (
        <UpcomingList exams={upcoming} onSelectExam={handleSelectUpcoming} />
      ) : (
        <ResultsList results={results} onSelectResult={handleSelectResult} />
      )}
      <ExamDetailsSheet
        mode={mode}
        selectedUpcoming={selectedUpcoming}
        selectedResult={selectedResult}
        isOpen={selectedUpcoming !== null || selectedResult !== null}
        onOpenChange={handleSheetOpenChange}
      />
    </section>
  )
}

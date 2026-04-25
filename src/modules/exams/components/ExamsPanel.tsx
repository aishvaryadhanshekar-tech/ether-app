import { useEffect, useState } from "react"
import { Card } from "@/design-system/components/Card"
import { useExams } from "@/modules/exams/selectors"
import { examsService } from "@/services/exams.service"

interface ExamsPanelProps {
  childId: string
}

export function ExamsPanel({ childId }: ExamsPanelProps) {
  const exams = useExams(childId)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await examsService.getByChild(childId)
      setLoading(false)
    }
    void load()
  }, [childId])

  return (
    <Card>
      <h3 className="screen-card-title">Exams</h3>
      {loading ? <p className="screen-card-copy">Loading...</p> : null}
      <ul className="exams-panel-list">
        {exams.map((exam) => (
          <li key={exam.id} className="exams-panel-item">
            <p className="exams-panel-subject">{exam.subject}</p>
            <p className="exams-panel-meta">Date: {exam.date ?? exam.examDate}</p>
            <p className="exams-panel-meta">
              Result: {exam.result ?? "pending"}
              {typeof exam.score === "number" && typeof exam.maxScore === "number"
                ? ` (${exam.score}/${exam.maxScore})`
                : ""}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  )
}

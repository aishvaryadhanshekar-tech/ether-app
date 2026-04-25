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
      <h3 className="mb-3 text-base font-semibold text-foreground">Exams</h3>
      {loading ? <p className="text-sm text-muted">Loading...</p> : null}
      <ul className="space-y-2">
        {exams.map((exam) => (
          <li key={exam.id} className="rounded-lg border border-border p-3">
            <p className="font-medium text-foreground">{exam.subject}</p>
            <p className="text-sm text-muted">Date: {exam.date ?? exam.examDate}</p>
            <p className="text-sm text-muted">
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

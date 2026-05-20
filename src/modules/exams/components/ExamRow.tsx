import type { UpcomingExam } from "@/modules/exams/types"

interface ExamRowProps {
  exam: UpcomingExam
  onClick: (exam: UpcomingExam) => void
  showSyllabusCta?: boolean
  topMeta?: string
}

function toTypeLabel(type: UpcomingExam["examType"]) {
  if (type === "unit_test") return "Unit Test"
  if (type === "practical") return "Practical"
  return "Term Exam"
}

export function ExamRow({
  exam,
  onClick,
  showSyllabusCta = false,
  topMeta,
}: ExamRowProps) {
  const hasSyllabus = Array.isArray(exam.syllabus) ? exam.syllabus.length > 0 : Boolean(exam.syllabus)
  const periodLabel = exam.period?.trim() ? exam.period : "-"

  return (
    <button type="button" className="exam-row" onClick={() => onClick(exam)}>
      <div className="exam-row-main">
        <div className="exam-row-left">
          {topMeta ? <p className="exam-row-top-label">{topMeta}</p> : null}
          <p className="exam-row-subject">
            {exam.subject} {toTypeLabel(exam.examType)}
          </p>
          <p className="exam-row-period">{periodLabel}</p>
        </div>
        {showSyllabusCta && hasSyllabus ? <span className="exam-row-link">Syllabus -&gt;</span> : null}
      </div>
    </button>
  )
}

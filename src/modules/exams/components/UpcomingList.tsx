import { ExamRow } from "@/modules/exams/components/ExamRow"
import type { UpcomingExam } from "@/modules/exams/types"

interface UpcomingListProps {
  exams: UpcomingExam[]
  onSelectExam: (exam: UpcomingExam) => void
}

export function UpcomingList({ exams, onSelectExam }: UpcomingListProps) {
  if (exams.length === 0) {
    return <p className="exams-empty-state">No upcoming exams scheduled. You're all caught up for now.</p>
  }

  const groupedByDate = exams.reduce<Record<string, UpcomingExam[]>>((acc, exam) => {
    const key = exam.date
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(exam)
    return acc
  }, {})

  const orderedDates = Object.keys(groupedByDate).sort((a, b) => a.localeCompare(b))

  return (
    <div className="upcoming-list">
      {orderedDates.map((date, index) => (
        <section key={date} className="upcoming-date-group">
          <p className="upcoming-date-header" data-first={index === 0}>
            {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
          <div className="upcoming-date-rows">
            {groupedByDate[date].map((exam) => (
              <ExamRow key={exam.id} exam={exam} onClick={onSelectExam} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

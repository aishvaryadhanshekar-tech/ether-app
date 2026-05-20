import dayjs from "dayjs"
import { ExamListCard } from "@/modules/exams/components/ExamListCard"
import type { UpcomingExam } from "@/modules/exams/types"

interface UpcomingListProps {
  exams: UpcomingExam[]
  onSelectExam: (exam: UpcomingExam) => void
}

export function UpcomingList({ exams, onSelectExam }: UpcomingListProps) {
  if (exams.length === 0) {
    return <p className="exams-empty-state">No upcoming exams. You're all set this week.</p>
  }

  const today = dayjs().startOf("day")
  const sorted = [...exams].sort((a, b) => a.date.localeCompare(b.date))
  const nextIndex = sorted.findIndex((exam) => !dayjs(exam.date).startOf("day").isBefore(today))
  const upcomingIndex = nextIndex >= 0 ? nextIndex : -1

  function toTypeLabel(type: UpcomingExam["examType"]) {
    if (type === "unit_test") return "Unit Test"
    if (type === "practical") return "Practical"
    return "Term Exam"
  }

  return (
    <div className="results-list">
      {sorted.map((exam, index) => (
        <ExamListCard
          key={exam.id}
          date={exam.date}
          title={`${exam.subject} ${toTypeLabel(exam.examType)}`}
          byline={exam.teacher ?? "Teacher"}
          rightPrimary="Syllabus ->"
          rightPrimaryAsCta
          chipLabel={index === upcomingIndex ? "Upcoming" : undefined}
          onClick={() => onSelectExam(exam)}
        />
      ))}
    </div>
  )
}

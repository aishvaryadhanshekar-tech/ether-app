import { ExamListCard } from "@/modules/exams/components/ExamListCard"
import type { ExamResult } from "@/modules/exams/types"

interface ResultCardProps {
  result: ExamResult
  onClick: (result: ExamResult) => void
}

export function ResultCard({ result, onClick }: ResultCardProps) {
  return (
    <ExamListCard
      date={result.date}
      title={result.name}
      byline={result.teacher ?? "Teacher"}
      rightPrimary={`${result.percentage}%`}
      rightSecondary={`Grade ${result.grade}`}
      onClick={() => onClick(result)}
    />
  )
}

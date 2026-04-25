import dayjs from "dayjs"
import type { ExamResult } from "@/modules/exams/types"

interface ResultCardProps {
  result: ExamResult
  onClick: (result: ExamResult) => void
}

export function ResultCard({ result, onClick }: ResultCardProps) {
  return (
    <button type="button" className="result-card" onClick={() => onClick(result)}>
      <div className="result-card-main">
        <div className="result-card-left">
          <div className="result-card-score-subject-row">
            <p className="result-card-score">{result.percentage}%</p>
            <p className="result-card-name">{result.name}</p>
          </div>
          <p className="result-card-grade">Grade {result.grade}</p>
        </div>
        <p className="result-card-date">{dayjs(result.date).format("MMM D")}</p>
      </div>
    </button>
  )
}

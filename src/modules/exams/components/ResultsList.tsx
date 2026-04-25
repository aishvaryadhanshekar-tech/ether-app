import { ResultCard } from "@/modules/exams/components/ResultCard"
import type { ExamResult } from "@/modules/exams/types"

interface ResultsListProps {
  results: ExamResult[]
  onSelectResult: (result: ExamResult) => void
}

export function ResultsList({ results, onSelectResult }: ResultsListProps) {
  if (results.length === 0) {
    return <p className="exams-empty-state">No results published yet.</p>
  }

  return (
    <div className="results-list">
      {results.map((result) => (
        <ResultCard key={result.id} result={result} onClick={onSelectResult} />
      ))}
    </div>
  )
}

import dayjs from "dayjs"
import { Button } from "@/design-system/components/Button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import type { ExamResult, UpcomingExam } from "@/modules/exams/types"

interface ExamDetailsSheetProps {
  mode: "upcoming" | "results"
  selectedUpcoming: UpcomingExam | null
  selectedResult: ExamResult | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

function toTypeLabel(type: UpcomingExam["examType"]) {
  if (type === "unit_test") return "Unit Test"
  if (type === "practical") return "Practical"
  return "Term Exam"
}

function toSyllabusList(syllabus?: string | string[]) {
  if (Array.isArray(syllabus)) return syllabus
  if (!syllabus) return []
  return syllabus
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

export function ExamDetailsSheet({
  mode,
  selectedUpcoming,
  selectedResult,
  isOpen,
  onOpenChange,
}: ExamDetailsSheetProps) {
  const shouldRender = mode === "upcoming" ? Boolean(selectedUpcoming) : Boolean(selectedResult)
  if (!shouldRender) {
    return null
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <div className="attendance-sheet-grabber" />
        <div className="attendance-sheet-body">
          {mode === "upcoming" && selectedUpcoming ? (
            <>
              <h3 className="attendance-sheet-title">{selectedUpcoming.subject}</h3>
              <div className="attendance-sheet-grid-two">
                <div className="attendance-sheet-data-card">
                  <p className="attendance-sheet-label">Exam Type</p>
                  <p className="attendance-sheet-value">{toTypeLabel(selectedUpcoming.examType)}</p>
                </div>
                <div className="attendance-sheet-data-card">
                  <p className="attendance-sheet-label">Period</p>
                  <p className="attendance-sheet-value">{selectedUpcoming.period ?? "-"}</p>
                </div>
              </div>
              <div className="attendance-sheet-data-card">
                <p className="attendance-sheet-label">Date</p>
                <p className="attendance-sheet-value">
                  {dayjs(selectedUpcoming.date).format("MMM D, YYYY")}
                </p>
              </div>
              <div className="attendance-sheet-data-card">
                <p className="attendance-sheet-label">Syllabus</p>
                {toSyllabusList(selectedUpcoming.syllabus).length === 0 ? (
                  <p className="attendance-sheet-value">No syllabus uploaded yet.</p>
                ) : (
                  <ul className="exam-sheet-bullets">
                    {toSyllabusList(selectedUpcoming.syllabus).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : null}

          {mode === "results" && selectedResult ? (
            <>
              <h3 className="attendance-sheet-title">{selectedResult.name}</h3>
              <div className="attendance-sheet-grid-two">
                <div className="attendance-sheet-data-card">
                  <p className="attendance-sheet-label">Score</p>
                  <p className="attendance-sheet-value">{selectedResult.percentage}%</p>
                </div>
                <div className="attendance-sheet-data-card">
                  <p className="attendance-sheet-label">Grade</p>
                  <p className="attendance-sheet-value">Grade {selectedResult.grade}</p>
                </div>
              </div>
              <div className="attendance-sheet-data-card">
                <p className="attendance-sheet-label">Subject Breakdown</p>
                <div className="exam-sheet-results-table">
                  {selectedResult.subjects.map((subject) => (
                    <div key={subject.subject} className="exam-sheet-results-row">
                      <p className="exam-sheet-results-subject">{subject.subject}</p>
                      <p className="exam-sheet-results-score">
                        {subject.marks} / {subject.maxMarks}
                      </p>
                      <p className="exam-sheet-results-grade">{subject.grade}</p>
                    </div>
                  ))}
                </div>
              </div>
              {selectedResult.reportCardUrl ? (
                <Button type="button" onClick={() => window.open(selectedResult.reportCardUrl, "_blank")}>
                  Download Report Card
                </Button>
              ) : null}
            </>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}

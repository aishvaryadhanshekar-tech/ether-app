export type ExamType = "unit_test" | "term" | "practical"
export type ExamOutcome = "pass" | "fail" | "pending"

export interface Exam {
  id: string
  childId: string
  subject: string
  examType: ExamType
  date: string
  period?: string
  syllabus?: string
  // Transitional alias used by existing UI/selectors.
  examDate?: string
  // Transitional fields used by legacy exam card UI.
  score?: number
  maxScore?: number
  result?: ExamOutcome
}

export interface SubjectResult {
  subject: string
  marks: number
  maxMarks: number
  grade: string
}

export interface ExamResult {
  id: string
  childId: string
  examName: string
  date: string
  percentage: number
  grade: string
  subjects: SubjectResult[]
  reportCardUrl?: string
}

// Transitional aliases to keep existing services/components stable.
export type ExamEntry = Exam
export type ExamsByChild = Record<string, Exam[]>

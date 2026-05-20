export type ExamType = "unit_test" | "term" | "practical"
export type ExamOutcome = "pass" | "fail" | "pending"

export interface UpcomingExam {
  id: string
  childId: string
  subject: string
  teacher?: string
  examType: ExamType
  date: string
  period?: string
  syllabus?: string | string[]
  // Transitional alias used by existing UI/selectors.
  examDate?: string
}

export interface Exam {
  id: string
  childId: string
  subject: string
  teacher?: string
  examType: ExamType
  date: string
  period?: string
  syllabus?: string | string[]
  examDate?: string
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
  name: string
  teacher?: string
  date: string
  percentage: number
  grade: string
  subjects: SubjectResult[]
  reportCardUrl?: string
}

// Transitional aliases to keep existing services/components stable.
export type ExamEntry = Exam
export type UpcomingExamsByChild = Record<string, UpcomingExam[]>
export type ExamResultsByChild = Record<string, ExamResult[]>
export type ExamsByChild = Record<string, Exam[]>

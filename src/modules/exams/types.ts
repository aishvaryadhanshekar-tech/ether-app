export type ExamResult = "pass" | "fail" | "pending"

export interface ExamEntry {
  id: string
  subject: string
  examDate: string
  score?: number
  maxScore?: number
  result: ExamResult
}

export type ExamsByChild = Record<string, ExamEntry[]>

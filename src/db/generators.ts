import type { SeedSchema } from "@/db/schema"

export function generateSeedData(): SeedSchema {
  return {
    children: [{ id: "child_1", name: "Aarav Mehta", className: "Grade 6-A" }],
    attendance: {
      child_1: [
        { date: "2026-03-01", status: "present", markedAt: "08:45" },
        { date: "2026-03-02", status: "absent" },
        { date: "2026-03-03", status: "late", markedAt: "09:11" },
      ],
    },
    exams: {
      child_1: [
        {
          id: "exam_math_march",
          subject: "Mathematics",
          examDate: "2026-04-03",
          score: 88,
          maxScore: 100,
          result: "pass",
        },
        {
          id: "exam_science_april",
          subject: "Science",
          examDate: "2026-04-17",
          result: "pending",
        },
      ],
    },
  }
}

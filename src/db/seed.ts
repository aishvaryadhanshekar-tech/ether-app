import { generateSeedData } from "@/db/generators"
import { attendanceService } from "@/services/attendance.service"
import { examsService } from "@/services/exams.service"

let hasSeeded = false

export async function seedApp() {
  if (hasSeeded) {
    return
  }

  const seed = generateSeedData()

  await Promise.all([
    ...Object.entries(seed.attendance).map(([childId, entries]) =>
      attendanceService.seed(childId, entries),
    ),
    ...Object.entries(seed.exams).map(([childId, entries]) =>
      examsService.seed(childId, entries),
    ),
  ])

  hasSeeded = true
}

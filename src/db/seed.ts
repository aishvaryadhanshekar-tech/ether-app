import { generateSeedData } from "@/db/generators"
import { attendanceService } from "@/services/attendance.service"
import { examsService } from "@/services/exams.service"
import { useAppStore } from "@/store/rootStore"

let hasSeeded = false

export async function seedApp() {
  if (hasSeeded) {
    return
  }

  const seed = generateSeedData()
  const snapshot = useAppStore.getState()
  if (Object.keys(snapshot.children).length === 0) {
    useAppStore.setState({
      children: seed.children,
      timetable: seed.timetable,
      results: seed.results,
      badges: seed.badges,
      learnSession: seed.learnSession,
    })
  }

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

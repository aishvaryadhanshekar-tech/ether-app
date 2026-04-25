import dayjs from "dayjs"
import type { SeedSchema } from "@/db/schema"
import type { AttendanceEntry, AttendanceStatus } from "@/modules/attendance/types"

function randomStatus(): AttendanceStatus {
  const rand = Math.random()
  if (rand < 0.1) {
    return "absent"
  }
  if (rand < 0.2) {
    return "late"
  }
  return "present"
}

function getRandomMarkedTime(status: AttendanceStatus) {
  if (status === "absent") {
    return undefined
  }
  return status === "late" ? "09:08" : "08:45"
}

function getForcedSchoolDate(monthStart: dayjs.Dayjs, preferredDay: number) {
  const daysInMonth = monthStart.daysInMonth()
  const clampedDay = Math.min(preferredDay, daysInMonth)
  let date = monthStart.date(clampedDay)

  if (date.day() === 6) {
    date = date.add(2, "day")
  } else if (date.day() === 0) {
    date = date.add(1, "day")
  }

  if (date.month() !== monthStart.month()) {
    date = monthStart.endOf("month")
    if (date.day() === 6) {
      date = date.subtract(1, "day")
    } else if (date.day() === 0) {
      date = date.subtract(2, "day")
    }
  }

  return date
}

export function generateAttendance(childId: string): AttendanceEntry[] {
  const monthStart = dayjs().startOf("month")
  const daysInMonth = monthStart.daysInMonth()
  const data: AttendanceEntry[] = []

  for (let i = 1; i <= daysInMonth; i += 1) {
    const day = monthStart.date(i)
    const dayOfWeek = day.day()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue
    }

    const date = day.format("YYYY-MM-DD")
    const status = randomStatus()
    const entry: AttendanceEntry = {
      id: `att_${childId}_${date}`,
      childId,
      date,
      status,
      markedAt: getRandomMarkedTime(status),
      periodsPresent: status === "present" ? 8 : status === "late" ? 7 : 0,
      isSchoolDay: true,
    }

    if (status === "absent" && Math.random() < 0.45) {
      const note = "Unwell and resting at home."
      entry.absentNote = {
        note,
        submittedAt: `${date}T12:15:00Z`,
      }
      entry.note = note
    }

    data.push(entry)
  }

  const forcedMissingNoteDate = getForcedSchoolDate(monthStart, 10).format("YYYY-MM-DD")
  const forcedLateDate = getForcedSchoolDate(monthStart, 19).format("YYYY-MM-DD")
  const forcedVacationDate = getForcedSchoolDate(monthStart, 23).format("YYYY-MM-DD")

  const forcedMissingNoteEntry = data.find((entry) => entry.date === forcedMissingNoteDate)
  if (forcedMissingNoteEntry) {
    forcedMissingNoteEntry.status = "absent"
    forcedMissingNoteEntry.markedAt = undefined
    forcedMissingNoteEntry.periodsPresent = 0
    forcedMissingNoteEntry.absentNote = undefined
    forcedMissingNoteEntry.note = undefined
  }

  const forcedLateEntry = data.find((entry) => entry.date === forcedLateDate)
  if (forcedLateEntry) {
    forcedLateEntry.status = "late"
    forcedLateEntry.markedAt = "09:17"
    forcedLateEntry.periodsPresent = 7
  }

  const forcedVacationEntry = data.find((entry) => entry.date === forcedVacationDate)
  if (forcedVacationEntry) {
    forcedVacationEntry.status = "holiday"
    forcedVacationEntry.markedAt = undefined
    forcedVacationEntry.periodsPresent = 0
    forcedVacationEntry.isSchoolDay = false
    forcedVacationEntry.absentNote = undefined
    forcedVacationEntry.note = "School vacation"
  }

  return data
}

export function generateSeedData(): SeedSchema {
  const childId = "child_1"
  return {
    children: {
      [childId]: {
        id: childId,
        name: "Aarav Mehta",
        class: "Grade 6",
        section: "A",
        rollNumber: "18",
        isActive: true,
      },
    },
    attendance: {
      [childId]: generateAttendance(childId),
    },
    timetable: {},
    exams: {
      [childId]: [
        {
          id: "exam_math_march",
          childId,
          subject: "Mathematics",
          examType: "unit_test",
          date: "2026-04-03",
          examDate: "2026-04-03",
          period: "P2",
          syllabus: "Ch 1-4, word problems and fractions",
          score: 88,
          maxScore: 100,
          result: "pass",
        },
        {
          id: "exam_science_april",
          childId,
          subject: "Science",
          examType: "term",
          date: "2026-04-17",
          examDate: "2026-04-17",
          period: "P4",
          syllabus: "Matter, force and simple machines",
          result: "pending",
        },
      ],
    },
    results: {},
    badges: {},
    learnSession: {
      [childId]: {
        childId,
        isActive: false,
      },
    },
  }
}

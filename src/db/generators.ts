import dayjs from "dayjs"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import type { SeedSchema } from "@/db/schema"
import type { AttendanceEntry, AttendanceStatus } from "@/modules/attendance/types"
import type { Exam } from "@/modules/exams/types"

dayjs.extend(isSameOrBefore)

/** March–April window for the school spring term shown in demos. */
export function springMarchAprilYearAndEnd(today: dayjs.Dayjs = dayjs()) {
  const t = today.startOf("day")
  const y = t.year()
  const mar1 = dayjs(`${y}-03-01`)
  const apr30 = dayjs(`${y}-04-30`)
  if (t.isBefore(mar1, "day")) {
    return { year: y - 1, lastDay: dayjs(`${y - 1}-04-30`) }
  }
  if (t.isAfter(apr30, "day")) {
    return { year: y, lastDay: apr30 }
  }
  return { year: y, lastDay: t }
}

function defaultArrivalTime(date: string): string {
  let sum = 0
  for (let i = 0; i < date.length; i += 1) {
    const code = date.charCodeAt(i)
    if (code >= 48 && code <= 57) {
      sum += code - 48
    }
  }
  const minute = 42 + (sum % 9)
  return `08:${String(minute).padStart(2, "0")}`
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

function firstWeekdayOnOrAfter(d: dayjs.Dayjs): dayjs.Dayjs {
  let cursor = d
  while (cursor.day() === 0 || cursor.day() === 6) {
    cursor = cursor.add(1, "day")
  }
  return cursor
}

function patchAbsentWithNote(date: string, text: string) {
  return {
    status: "absent" as const,
    markedAt: undefined,
    periodsPresent: 0,
    isSchoolDay: true,
    absentNote: { note: text, submittedAt: `${date}T10:30:00Z` },
    note: text,
  }
}

function patchAbsentNoNote() {
  return {
    status: "absent" as const,
    markedAt: undefined,
    periodsPresent: 0,
    isSchoolDay: true,
    absentNote: undefined,
    note: undefined,
  }
}

function patchLate(time: string) {
  return {
    status: "late" as const,
    markedAt: time,
    periodsPresent: 7,
    isSchoolDay: true,
    absentNote: undefined,
    note: undefined,
  }
}

function patchHoliday() {
  return {
    status: "holiday" as const,
    markedAt: undefined,
    periodsPresent: 0,
    isSchoolDay: false,
    absentNote: undefined,
    note: "School closed — scheduled break",
  }
}

function buildExamsForChild(childId: string, year: number): Exam[] {
  const marchStart = dayjs(`${year}-03-01`)
  const mathUnit = firstWeekdayOnOrAfter(marchStart.add(5, "day"))
  const englishFormative = firstWeekdayOnOrAfter(marchStart.add(18, "day"))
  const aprilStart = dayjs(`${year}-04-01`)
  const hindiCompleted = firstWeekdayOnOrAfter(aprilStart.add(2, "day"))
  const scienceTerm = firstWeekdayOnOrAfter(aprilStart.add(14, "day"))

  const exams: Exam[] = [
    {
      id: `exam_math_${mathUnit.format("YYYY-MM-DD")}`,
      childId,
      subject: "Mathematics",
      examType: "unit_test",
      date: mathUnit.format("YYYY-MM-DD"),
      examDate: mathUnit.format("YYYY-MM-DD"),
      period: "P2",
      syllabus: "Fractions, ratios, and introductory algebra",
      score: 86,
      maxScore: 100,
      result: "pass",
    },
    {
      id: `exam_english_${englishFormative.format("YYYY-MM-DD")}`,
      childId,
      subject: "English",
      examType: "unit_test",
      date: englishFormative.format("YYYY-MM-DD"),
      examDate: englishFormative.format("YYYY-MM-DD"),
      period: "P1",
      syllabus: "Reading comprehension and descriptive writing",
      score: 78,
      maxScore: 100,
      result: "pass",
    },
    {
      id: `exam_hindi_${hindiCompleted.format("YYYY-MM-DD")}`,
      childId,
      subject: "Hindi",
      examType: "unit_test",
      date: hindiCompleted.format("YYYY-MM-DD"),
      examDate: hindiCompleted.format("YYYY-MM-DD"),
      period: "P3",
      syllabus: "व्याकरण और अपठित गद्यांश",
      score: 82,
      maxScore: 100,
      result: "pass",
    },
    {
      id: `exam_science_${scienceTerm.format("YYYY-MM-DD")}`,
      childId,
      subject: "Science",
      examType: "term",
      date: scienceTerm.format("YYYY-MM-DD"),
      examDate: scienceTerm.format("YYYY-MM-DD"),
      period: "P4",
      syllabus: "Matter, force, and simple machines",
      result: "pending",
    },
  ]

  return exams.sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
}

type DayPatch = Pick<
  AttendanceEntry,
  "status" | "markedAt" | "periodsPresent" | "absentNote" | "note" | "isSchoolDay"
>

function mergePatches(
  lastDay: dayjs.Dayjs,
  patches: Array<{ day: dayjs.Dayjs; apply: (date: string) => DayPatch }>,
): Record<string, DayPatch> {
  const byDate: Record<string, DayPatch> = {}
  for (const { day, apply } of patches) {
    const wd = firstWeekdayOnOrAfter(day)
    if (wd.isAfter(lastDay, "day")) {
      continue
    }
    const key = wd.format("YYYY-MM-DD")
    byDate[key] = apply(key)
  }
  return byDate
}

export function generateAttendance(childId: string, year: number, lastDay: dayjs.Dayjs): AttendanceEntry[] {
  const rangeStart = dayjs(`${year}-03-01`).startOf("day")
  const data: AttendanceEntry[] = []

  for (
    let cursor = rangeStart.clone();
    cursor.isSameOrBefore(lastDay, "day");
    cursor = cursor.add(1, "day")
  ) {
    const dayOfWeek = cursor.day()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue
    }

    const date = cursor.format("YYYY-MM-DD")
    const status: AttendanceStatus = "present"
    const entry: AttendanceEntry = {
      id: `att_${childId}_${date}`,
      childId,
      date,
      status,
      markedAt: defaultArrivalTime(date),
      periodsPresent: 8,
      isSchoolDay: true,
    }

    data.push(entry)
  }

  const marchStart = dayjs(`${year}-03-01`)
  const aprilStart = dayjs(`${year}-04-01`)

  const applyMonthDemoMarkers = (monthStart: dayjs.Dayjs) => {
    const absentNoNoteDate = getForcedSchoolDate(monthStart, 10).format("YYYY-MM-DD")
    const lateDate = getForcedSchoolDate(monthStart, 19).format("YYYY-MM-DD")
    const holidayDate = getForcedSchoolDate(monthStart, 23).format("YYYY-MM-DD")

    const absentNoNoteEntry = data.find((e) => e.date === absentNoNoteDate)
    if (absentNoNoteEntry) {
      Object.assign(absentNoNoteEntry, patchAbsentNoNote())
    }

    const lateEntry = data.find((e) => e.date === lateDate)
    if (lateEntry) {
      Object.assign(lateEntry, patchLate("09:16"))
    }

    const holidayEntry = data.find((e) => e.date === holidayDate)
    if (holidayEntry) {
      Object.assign(holidayEntry, patchHoliday())
    }
  }

  applyMonthDemoMarkers(marchStart)
  applyMonthDemoMarkers(aprilStart)

  const extraPatches = mergePatches(lastDay, [
    {
      day: marchStart.add(3, "day"),
      apply: (d) => patchAbsentWithNote(d, "Viral fever; doctor advised rest at home."),
    },
    {
      day: marchStart.add(11, "day"),
      apply: (d) => patchAbsentWithNote(d, "Stomach upset — stayed home and hydrated."),
    },
    {
      day: marchStart.add(16, "day"),
      apply: (d) => patchAbsentWithNote(d, "Family travel day; informed class teacher."),
    },
    {
      day: marchStart.add(26, "day"),
      apply: () => patchAbsentNoNote(),
    },
    {
      day: marchStart.add(7, "day"),
      apply: () => patchLate("09:12"),
    },
    {
      day: aprilStart.add(3, "day"),
      apply: (d) => patchAbsentWithNote(d, "Bad migraine in the morning; slept it off."),
    },
    {
      day: aprilStart.add(8, "day"),
      apply: (d) => patchAbsentWithNote(d, "Cold and cough; avoiding school to recover."),
    },
    {
      day: aprilStart.add(12, "day"),
      apply: (d) => patchAbsentWithNote(d, "Dental procedure in the morning."),
    },
    {
      day: aprilStart.add(20, "day"),
      apply: () => patchAbsentNoNote(),
    },
    {
      day: aprilStart.add(6, "day"),
      apply: () => patchLate("09:21"),
    },
    {
      day: aprilStart.add(17, "day"),
      apply: () => patchLate("09:07"),
    },
  ])

  for (const entry of data) {
    const patch = extraPatches[entry.date]
    if (!patch) {
      continue
    }
    Object.assign(entry, patch)
  }

  return data.sort((a, b) => a.date.localeCompare(b.date))
}

export function generateSeedData(): SeedSchema {
  const childId = "child_1"
  const { year, lastDay } = springMarchAprilYearAndEnd()
  return {
    children: {
      [childId]: {
        id: childId,
        name: "Aarav Mehta",
        photoUrl: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=200&q=80",
        class: "Grade 6",
        section: "A",
        rollNumber: "18",
        isActive: true,
      },
    },
    attendance: {
      [childId]: generateAttendance(childId, year, lastDay),
    },
    timetable: {},
    exams: {
      [childId]: buildExamsForChild(childId, year),
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

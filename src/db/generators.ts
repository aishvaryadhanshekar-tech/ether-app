import dayjs from "dayjs"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import type { SeedSchema } from "@/db/schema"
import type { AttendanceEntry, AttendanceStatus } from "@/modules/attendance/types"
import { badgeTypes, type Badge } from "@/modules/badges/types"
import type { Exam } from "@/modules/exams/types"
import type { TimetableDay, TimetableWeek } from "@/modules/timetable/types"

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
      teacher: "Mr. Sharma",
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
      teacher: "Ms. D'Souza",
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
      teacher: "Ms. Verma",
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
      teacher: "Mrs. Iyer",
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

function buildDayPeriods(day: TimetableDay["day"]) {
  const timetableByDay: Record<
    TimetableDay["day"],
    Array<{ subject: string; teacher: string; startTime: string; endTime: string; isBreak?: boolean }>
  > = {
    mon: [
      { subject: "Mathematics", teacher: "Mr. Sharma", startTime: "08:00", endTime: "08:45" },
      { subject: "English", teacher: "Ms. D'Souza", startTime: "08:50", endTime: "09:35" },
      { subject: "Science", teacher: "Mrs. Iyer", startTime: "09:40", endTime: "10:25" },
      { subject: "Lunch Break", teacher: "", startTime: "10:25", endTime: "10:55", isBreak: true },
      { subject: "Social Studies", teacher: "Mr. Khan", startTime: "11:00", endTime: "11:45" },
      { subject: "Hindi", teacher: "Ms. Verma", startTime: "11:50", endTime: "12:35" },
      { subject: "Computer", teacher: "Mr. Nair", startTime: "12:40", endTime: "13:25" },
    ],
    tue: [
      { subject: "English", teacher: "Ms. D'Souza", startTime: "08:00", endTime: "08:45" },
      { subject: "Mathematics", teacher: "Mr. Sharma", startTime: "08:50", endTime: "09:35" },
      { subject: "Computer", teacher: "Mr. Nair", startTime: "09:40", endTime: "10:25" },
      { subject: "Lunch Break", teacher: "", startTime: "10:25", endTime: "10:55", isBreak: true },
      { subject: "Science", teacher: "Mrs. Iyer", startTime: "11:00", endTime: "11:45" },
      { subject: "Art", teacher: "Ms. Kulkarni", startTime: "11:50", endTime: "12:35" },
      { subject: "Hindi", teacher: "Ms. Verma", startTime: "12:40", endTime: "13:25" },
    ],
    wed: [
      { subject: "Science", teacher: "Mrs. Iyer", startTime: "08:00", endTime: "08:45" },
      { subject: "Mathematics", teacher: "Mr. Sharma", startTime: "08:50", endTime: "09:35" },
      { subject: "Social Studies", teacher: "Mr. Khan", startTime: "09:40", endTime: "10:25" },
      { subject: "Lunch Break", teacher: "", startTime: "10:25", endTime: "10:55", isBreak: true },
      { subject: "English", teacher: "Ms. D'Souza", startTime: "11:00", endTime: "11:45" },
      { subject: "Physical Education", teacher: "Mr. Das", startTime: "11:50", endTime: "12:35" },
      { subject: "Computer", teacher: "Mr. Nair", startTime: "12:40", endTime: "13:25" },
    ],
    thu: [
      { subject: "Hindi", teacher: "Ms. Verma", startTime: "08:00", endTime: "08:45" },
      { subject: "Science", teacher: "Mrs. Iyer", startTime: "08:50", endTime: "09:35" },
      { subject: "English", teacher: "Ms. D'Souza", startTime: "09:40", endTime: "10:25" },
      { subject: "Lunch Break", teacher: "", startTime: "10:25", endTime: "10:55", isBreak: true },
      { subject: "Mathematics", teacher: "Mr. Sharma", startTime: "11:00", endTime: "11:45" },
      { subject: "Library", teacher: "Ms. Joseph", startTime: "11:50", endTime: "12:35" },
      { subject: "Social Studies", teacher: "Mr. Khan", startTime: "12:40", endTime: "13:25" },
    ],
    fri: [
      { subject: "Mathematics", teacher: "Mr. Sharma", startTime: "08:00", endTime: "08:45" },
      { subject: "Computer", teacher: "Mr. Nair", startTime: "08:50", endTime: "09:35" },
      { subject: "English", teacher: "Ms. D'Souza", startTime: "09:40", endTime: "10:25" },
      { subject: "Lunch Break", teacher: "", startTime: "10:25", endTime: "10:55", isBreak: true },
      { subject: "Science", teacher: "Mrs. Iyer", startTime: "11:00", endTime: "11:45" },
      { subject: "Hindi", teacher: "Ms. Verma", startTime: "11:50", endTime: "12:35" },
      { subject: "Music", teacher: "Mr. Pinto", startTime: "12:40", endTime: "13:25" },
    ],
  }

  return timetableByDay[day].map((period, index) => ({
    id: period.isBreak ? `${day}_break_lunch` : `${day}_p${index + 1}`,
    ...period,
  }))
}

function buildTimetableWeek(childId: string, today: dayjs.Dayjs = dayjs()): TimetableWeek {
  const weekday = today.day()
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1
  const weekStartDate = today.subtract(daysFromMonday, "day").format("YYYY-MM-DD")
  const orderedDays: TimetableDay["day"][] = ["mon", "tue", "wed", "thu", "fri"]

  return {
    childId,
    weekStartDate,
    days: orderedDays.map((day) => ({
      day,
      periods: buildDayPeriods(day),
    })),
  }
}

function buildBadgesForChild(childId: string, year: number): Badge[] {
  const marchStart = dayjs(`${year}-03-01`)
  const aprilStart = dayjs(`${year}-04-01`)

  const kindnessDate = firstWeekdayOnOrAfter(marchStart.add(6, "day")).format("YYYY-MM-DD")
  const teamworkDate = firstWeekdayOnOrAfter(aprilStart.add(2, "day")).format("YYYY-MM-DD")
  const creativityDate = firstWeekdayOnOrAfter(aprilStart.add(9, "day")).format("YYYY-MM-DD")
  const kindnessEncoreDate = firstWeekdayOnOrAfter(aprilStart.add(14, "day")).format("YYYY-MM-DD")
  const focusDate = firstWeekdayOnOrAfter(aprilStart.add(18, "day")).format("YYYY-MM-DD")
  const teamworkEncoreDate = firstWeekdayOnOrAfter(aprilStart.add(24, "day")).format("YYYY-MM-DD")

  const kindness = badgeTypes.find((type) => type.id === "kindness-star")
  const teamwork = badgeTypes.find((type) => type.id === "team-player")
  const creativity = badgeTypes.find((type) => type.id === "creative-thinker")
  const focus = badgeTypes.find((type) => type.id === "focused-learner")

  if (!kindness || !teamwork || !creativity || !focus) {
    return []
  }

  return [
    {
      id: `badge_${childId}_teamwork_encore_${teamworkEncoreDate}`,
      childId,
      badgeTypeId: teamwork.id,
      title: teamwork.title,
      icon: teamwork.icon,
      tone: teamwork.tone,
      awardedBy: {
        teacherName: "Mr. Khan",
        role: "Class Teacher",
      },
      comment: "Stepped in to help a quieter classmate join the group discussion and kept the team working kindly.",
      awardedAt: teamworkEncoreDate,
      isNew: true,
    },
    {
      id: `badge_${childId}_focus_${focusDate}`,
      childId,
      badgeTypeId: focus.id,
      title: focus.title,
      icon: focus.icon,
      tone: focus.tone,
      awardedBy: {
        teacherName: "Mrs. Iyer",
        role: "Science Teacher",
      },
      comment: "Stayed deeply engaged during the simple machines activity and helped others settle quickly.",
      awardedAt: focusDate,
      isNew: true,
    },
    {
      id: `badge_${childId}_kindness_encore_${kindnessEncoreDate}`,
      childId,
      badgeTypeId: kindness.id,
      title: kindness.title,
      icon: kindness.icon,
      tone: kindness.tone,
      awardedBy: {
        teacherName: "Ms. Joseph",
        role: "Library Teacher",
      },
      comment: "Offered to share materials and made sure everyone at the reading table felt included.",
      awardedAt: kindnessEncoreDate,
    },
    {
      id: `badge_${childId}_creative_${creativityDate}`,
      childId,
      badgeTypeId: creativity.id,
      title: creativity.title,
      icon: creativity.icon,
      tone: creativity.tone,
      awardedBy: {
        teacherName: "Ms. Kulkarni",
        role: "Art Teacher",
      },
      comment: "Brought a fresh idea to the poster task and explained the concept with confidence.",
      awardedAt: creativityDate,
    },
    {
      id: `badge_${childId}_teamwork_${teamworkDate}`,
      childId,
      badgeTypeId: teamwork.id,
      title: teamwork.title,
      icon: teamwork.icon,
      tone: teamwork.tone,
      awardedBy: {
        teacherName: "Mr. Das",
        role: "PE Teacher",
      },
      awardedAt: teamworkDate,
    },
    {
      id: `badge_${childId}_kindness_${kindnessDate}`,
      childId,
      badgeTypeId: kindness.id,
      title: kindness.title,
      icon: kindness.icon,
      tone: kindness.tone,
      awardedBy: {
        teacherName: "Ms. D'Souza",
        role: "English Teacher",
      },
      comment: "Checked on a classmate who was feeling overwhelmed and quietly helped them get started.",
      awardedAt: kindnessDate,
    },
  ]
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
  const primaryChildId = "child_1"
  const secondaryChildId = "child_2"
  const { year, lastDay } = springMarchAprilYearAndEnd()
  return {
    children: {
      [primaryChildId]: {
        id: primaryChildId,
        name: "Aarav Mehta",
        photoUrl: "/images/aarav-mehta.png",
        class: "Grade 6",
        section: "A",
        rollNumber: "18",
        isActive: true,
      },
      [secondaryChildId]: {
        id: secondaryChildId,
        name: "Mira Mehta",
        photoUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=200&q=80",
        class: "Grade 3",
        section: "C",
        rollNumber: "07",
        isActive: false,
      },
    },
    attendance: {
      [primaryChildId]: generateAttendance(primaryChildId, year, lastDay),
      [secondaryChildId]: generateAttendance(secondaryChildId, year, lastDay),
    },
    timetable: {
      [primaryChildId]: buildTimetableWeek(primaryChildId),
      [secondaryChildId]: buildTimetableWeek(secondaryChildId),
    },
    exams: {
      [primaryChildId]: buildExamsForChild(primaryChildId, year),
      [secondaryChildId]: buildExamsForChild(secondaryChildId, year),
    },
    results: {},
    badges: {
      [primaryChildId]: buildBadgesForChild(primaryChildId, year),
      [secondaryChildId]: [],
    },
    fees: {
      termLabel: "Term 2 2026-2027",
      dueDate: "2026-08-20",
      childBalancesPaise: {
        [primaryChildId]: 2_000_000,
        [secondaryChildId]: 1_450_000,
      },
      outstandingBreakdown: {
        [primaryChildId]: [
          { category: "Tuition Fee", amountPaise: 1_500_000 },
          { category: "Activity Fee", amountPaise: 300_000 },
          { category: "Transport Fee", amountPaise: 200_000 },
        ],
        [secondaryChildId]: [
          { category: "Tuition Fee", amountPaise: 1_000_000 },
          { category: "Activity Fee", amountPaise: 250_000 },
          { category: "Stationery & Resources", amountPaise: 200_000 },
        ],
      },
      termBreakdown: {
        [primaryChildId]: [
          {
            id: "tuition",
            label: "Tuition",
            items: [
              { id: "tuition-grade", label: "Tuition Fee - Grade 6", amountPaise: 1_200_000 },
              { id: "development-fund", label: "Development Fund", amountPaise: 200_000 },
              { id: "exams", label: "Exams & Evaluation Charges", amountPaise: 100_000 },
            ],
          },
          {
            id: "activities",
            label: "Activities",
            items: [
              { id: "lab", label: "Computer & Science Lab Fee", amountPaise: 150_000 },
              { id: "library-art", label: "Library, Art & Activity Kit", amountPaise: 150_000 },
            ],
          },
          {
            id: "transport",
            label: "Transport",
            items: [
              { id: "bus", label: "School Bus Transport (Term 2)", amountPaise: 200_000 },
            ],
          },
        ],
        [secondaryChildId]: [
          {
            id: "tuition",
            label: "Tuition",
            items: [
              { id: "tuition-grade", label: "Tuition Fee - Grade 3", amountPaise: 850_000 },
              { id: "exams", label: "Exams & Evaluation Charges", amountPaise: 150_000 },
            ],
          },
          {
            id: "activities",
            label: "Activities",
            items: [
              { id: "lab", label: "Computer & Science Lab Fee", amountPaise: 100_000 },
              { id: "library-sports", label: "Library & Sports Meet", amountPaise: 150_000 },
            ],
          },
          {
            id: "stationery",
            label: "Stationery & Resources",
            items: [
              { id: "books", label: "Books & Stationery", amountPaise: 150_000 },
              { id: "development-fund", label: "Development Fund", amountPaise: 50_000 },
            ],
          },
        ],
      },
      upcoming: {
        termLabel: "Term 3 2026-2027",
        dueDate: "2026-12-15",
        dueDateText: "Due 15 Dec 2026",
        childBalancesPaise: {
          [primaryChildId]: 2_100_000,
          [secondaryChildId]: 1_500_000,
        },
        outstandingBreakdown: {
          [primaryChildId]: [
            { category: "Tuition Fee", amountPaise: 1_600_000 },
            { category: "Activity Fee", amountPaise: 300_000 },
            { category: "Transport Fee", amountPaise: 200_000 },
          ],
          [secondaryChildId]: [
            { category: "Tuition Fee", amountPaise: 1_100_000 },
            { category: "Activity Fee", amountPaise: 250_000 },
            { category: "Stationery & Resources", amountPaise: 150_000 },
          ],
        },
      },
    },
    feeTransactions: [
      {
        id: "tx_2026_0412",
        receiptNumber: "REC-2026-0412",
        childId: primaryChildId,
        childName: "Aarav Mehta",
        termLabel: "Term 1 2026-2027",
        amountPaise: 2_250_000,
        date: "2026-04-12T10:30:00Z",
        paymentMethod: "upi",
        paymentMethodDetails: "UPI (aarav@upi)",
        paidBy: "Rajesh Mehta (Parent)",
        status: "successful",
        breakdown: [
          { category: "Tuition Fee", amountPaise: 1_800_000 },
          { category: "Activity Fee", amountPaise: 300_000 },
          { category: "Transport Fee", amountPaise: 150_000 },
        ],
      },
      {
        id: "tx_2026_0414",
        receiptNumber: "REC-2026-0414",
        childId: secondaryChildId,
        childName: "Mira Mehta",
        termLabel: "Term 1 2026-2027",
        amountPaise: 1_800_000,
        date: "2026-04-14T15:45:00Z",
        paymentMethod: "net_banking",
        paymentMethodDetails: "Net Banking (ICICI Bank - ****4102)",
        paidBy: "Rajesh Mehta (Parent)",
        status: "successful",
        breakdown: [
          { category: "Tuition Fee", amountPaise: 1_500_000 },
          { category: "Activity Fee", amountPaise: 200_000 },
          { category: "Stationery & Resources", amountPaise: 100_000 },
        ],
      },
      {
        id: "tx_2026_0115_aarav",
        receiptNumber: "REC-2026-0115-A",
        childId: primaryChildId,
        childName: "Aarav Mehta",
        termLabel: "Annual Fees 2025-2026",
        amountPaise: 700_000,
        date: "2026-01-15T09:15:00Z",
        paymentMethod: "card",
        paymentMethodDetails: "HDFC Credit Card (****8921)",
        paidBy: "Priya Mehta (Parent)",
        status: "successful",
        breakdown: [
          { category: "Activity Fee", amountPaise: 400_000 },
          { category: "Transport Fee", amountPaise: 300_000 },
        ],
      },
      {
        id: "tx_2026_0115_mira",
        receiptNumber: "REC-2026-0115-M",
        childId: secondaryChildId,
        childName: "Mira Mehta",
        termLabel: "Annual Fees 2025-2026",
        amountPaise: 500_000,
        date: "2026-01-15T09:16:00Z",
        paymentMethod: "card",
        paymentMethodDetails: "HDFC Credit Card (****8921)",
        paidBy: "Priya Mehta (Parent)",
        status: "successful",
        breakdown: [
          { category: "Activity Fee", amountPaise: 300_000 },
          { category: "Transport Fee", amountPaise: 200_000 },
        ],
      },
      {
        id: "tx_2025_1102",
        receiptNumber: "REC-2025-1102",
        childId: primaryChildId,
        childName: "Aarav Mehta",
        termLabel: "Term 3 2025-2026",
        amountPaise: 2_000_000,
        date: "2025-11-02T11:20:00Z",
        paymentMethod: "upi",
        paymentMethodDetails: "UPI (rajesh@okaxis)",
        paidBy: "Rajesh Mehta (Parent)",
        status: "successful",
        breakdown: [
          { category: "Tuition Fee", amountPaise: 1_700_000 },
          { category: "Activity Fee", amountPaise: 300_000 },
        ],
      },
    ],
    learnSession: {
      [primaryChildId]: {
        childId: primaryChildId,
        isActive: false,
      },
      [secondaryChildId]: {
        childId: secondaryChildId,
        isActive: false,
      },
    },
  }
}

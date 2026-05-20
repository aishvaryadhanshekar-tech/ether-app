import dayjs from "dayjs"
import type { Period, TimetableDay, TimetableDayName } from "@/modules/timetable/types"

const dayLabelMap: Record<TimetableDayName, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
}

const dayNumberMap: Record<TimetableDayName, number> = {
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
}

interface PrintableWeekTimetableOptions {
  childName: string
  weekDays: TimetableDay[]
  weekStartDate?: string
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

function formatTimeDisplay(time: string) {
  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours, 10)
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${minutes}`
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function resolveWeekStart(weekStartDate?: string) {
  if (weekStartDate) return dayjs(weekStartDate)

  const today = dayjs()
  const weekday = today.day()
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1
  return today.subtract(daysFromMonday, "day")
}

function resolveWeekRangeLabel(weekStartDate?: string) {
  const weekStart = resolveWeekStart(weekStartDate)
  const weekEnd = weekStart.add(4, "day")

  if (weekStart.month() === weekEnd.month()) {
    return `${weekStart.format("D")} - ${weekEnd.format("D MMM YYYY")}`
  }

  return `${weekStart.format("D MMM")} - ${weekEnd.format("D MMM YYYY")}`
}

function getPeriodsForSlot(weekDays: TimetableDay[], dayName: TimetableDayName, slotMinutes: number) {
  const day = weekDays.find((entry) => entry.day === dayName)
  if (!day) return []

  return day.periods.filter((period) => toMinutes(period.startTime) === slotMinutes)
}

function renderPeriodContent(periods: Period[]) {
  if (periods.length === 0) {
    return '<div class="print-empty-cell">-</div>'
  }

  return periods
    .map((period) => {
      const subject = escapeHtml(period.subject)
      const teacher = escapeHtml(period.teacher)
      const timeRange = `${formatTimeDisplay(period.startTime)} - ${formatTimeDisplay(period.endTime)}`

      if (period.isBreak) {
        return `
          <div class="print-period-card print-period-card-break">
            <div class="print-period-title">${subject}</div>
            <div class="print-period-meta">${escapeHtml(timeRange)}</div>
          </div>
        `
      }

      return `
        <div class="print-period-card">
          <div class="print-period-title">${subject}</div>
          <div class="print-period-meta">${escapeHtml(teacher)}</div>
          <div class="print-period-meta">${escapeHtml(timeRange)}</div>
        </div>
      `
    })
    .join("")
}

function buildPrintableWeekTimetableHtml({
  childName,
  weekDays,
  weekStartDate,
}: PrintableWeekTimetableOptions) {
  const weekStart = resolveWeekStart(weekStartDate)
  const slots = new Set<number>()

  weekDays.forEach((day) => {
    day.periods.forEach((period) => {
      slots.add(toMinutes(period.startTime))
    })
  })

  const sortedSlots = Array.from(slots).sort((a, b) => a - b)
  const weekRangeLabel = resolveWeekRangeLabel(weekStartDate)
  const tableHeaders = weekDays
    .map((day) => {
      const dayDate = weekStart.add(dayNumberMap[day.day] - 1, "day")
      return `
        <th scope="col">
          <div class="print-day-label">${dayLabelMap[day.day]}</div>
          <div class="print-day-date">${dayDate.format("D MMM")}</div>
        </th>
      `
    })
    .join("")

  const rows = sortedSlots
    .map((slotMinutes) => {
      const timeLabel = formatTimeDisplay(
        `${String(Math.floor(slotMinutes / 60)).padStart(2, "0")}:${String(slotMinutes % 60).padStart(2, "0")}`,
      )
      const cells = weekDays
        .map((day) => `<td>${renderPeriodContent(getPeriodsForSlot(weekDays, day.day, slotMinutes))}</td>`)
        .join("")

      return `
        <tr>
          <th scope="row" class="print-time-column">${escapeHtml(timeLabel)}</th>
          ${cells}
        </tr>
      `
    })
    .join("")

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(childName)} Weekly Timetable</title>
    <style>
      :root {
        color-scheme: light;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: "Geist Variable", "Segoe UI", sans-serif;
        color: #111827;
        background: #ffffff;
      }

      main {
        padding: 24px;
      }

      .print-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 16px;
        margin-bottom: 20px;
      }

      .print-kicker {
        margin: 0 0 6px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #4b5563;
      }

      .print-title {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        line-height: 1.1;
      }

      .print-subtitle {
        margin: 8px 0 0;
        font-size: 14px;
        color: #4b5563;
      }

      .print-grid {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
      }

      .print-grid th,
      .print-grid td {
        border: 1px solid #d1d5db;
        vertical-align: top;
      }

      .print-grid thead th {
        padding: 12px 10px;
        background: #f9fafb;
        text-align: left;
      }

      .print-grid tbody th,
      .print-grid tbody td {
        padding: 10px;
      }

      .print-time-column {
        width: 88px;
        background: #f9fafb;
        font-size: 12px;
        font-weight: 700;
        color: #374151;
        text-align: left;
      }

      .print-day-label {
        font-size: 14px;
        font-weight: 700;
      }

      .print-day-date {
        margin-top: 2px;
        font-size: 12px;
        color: #6b7280;
      }

      .print-period-card {
        border: 1px solid #d1d5db;
        border-radius: 8px;
        padding: 8px;
      }

      .print-period-card + .print-period-card {
        margin-top: 8px;
      }

      .print-period-card-break {
        background: #f9fafb;
      }

      .print-period-title {
        font-size: 13px;
        font-weight: 700;
        line-height: 1.35;
        word-break: break-word;
      }

      .print-period-meta {
        margin-top: 4px;
        font-size: 11px;
        color: #4b5563;
        line-height: 1.4;
        word-break: break-word;
      }

      .print-empty-cell {
        font-size: 12px;
        color: #9ca3af;
      }

      @media print {
        @page {
          size: A4 landscape;
          margin: 12mm;
        }

        main {
          padding: 0;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <header class="print-header">
        <div>
          <p class="print-kicker">Weekly Timetable</p>
          <h1 class="print-title">${escapeHtml(childName)}</h1>
          <p class="print-subtitle">${escapeHtml(weekRangeLabel)}</p>
        </div>
      </header>
      <table class="print-grid" aria-label="Weekly timetable">
        <thead>
          <tr>
            <th scope="col">Time</th>
            ${tableHeaders}
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </main>
    <script>
      window.addEventListener("load", function () {
        window.print();
      });
    </script>
  </body>
</html>`
}

export function openWeekTimetablePrintView(options: PrintableWeekTimetableOptions) {
  if (typeof window === "undefined" || options.weekDays.length === 0) {
    return
  }

  const printWindow = window.open("", "_blank")
  if (!printWindow) {
    return
  }

  printWindow.document.open()
  printWindow.document.write(buildPrintableWeekTimetableHtml(options))
  printWindow.document.close()
}

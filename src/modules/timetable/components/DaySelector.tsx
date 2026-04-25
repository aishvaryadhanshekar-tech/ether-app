import type { TimetableDayName } from "@/modules/timetable/types"

interface DaySelectorProps {
  selectedDay: TimetableDayName
  onSelectDay: (day: TimetableDayName) => void
}

const dayItems: Array<{ day: TimetableDayName; label: string }> = [
  { day: "mon", label: "Mon" },
  { day: "tue", label: "Tue" },
  { day: "wed", label: "Wed" },
  { day: "thu", label: "Thu" },
  { day: "fri", label: "Fri" },
]

export function DaySelector({ selectedDay, onSelectDay }: DaySelectorProps) {
  return (
    <div className="timetable-day-selector" aria-label="Weekday filter">
      {dayItems.map((item) => (
        <button
          key={item.day}
          type="button"
          aria-pressed={selectedDay === item.day}
          className="timetable-day-filter"
          data-active={selectedDay === item.day ? "true" : "false"}
          onClick={() => onSelectDay(item.day)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

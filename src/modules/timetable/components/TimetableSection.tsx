import { useMemo, useState } from "react"
import dayjs from "dayjs"
import { DaySelector } from "@/modules/timetable/components/DaySelector"
import { PeriodDetailsSheet } from "@/modules/timetable/components/PeriodDetailsSheet"
import { PeriodList } from "@/modules/timetable/components/PeriodList"
import { useTimetableDay } from "@/modules/timetable/selectors"
import type { Period, TimetableDayName } from "@/modules/timetable/types"

interface TimetableSectionProps {
  childId: string
}

function resolveDefaultDay(today: dayjs.Dayjs): TimetableDayName {
  const index = today.day()
  const dayByIndex: Record<number, TimetableDayName> = {
    1: "mon",
    2: "tue",
    3: "wed",
    4: "thu",
    5: "fri",
  }
  return dayByIndex[index] ?? "mon"
}

export function TimetableSection({ childId }: TimetableSectionProps) {
  const today = dayjs()
  const [selectedDay, setSelectedDay] = useState<TimetableDayName>(() =>
    resolveDefaultDay(today),
  )
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null)
  const [isSheetOpen, setSheetOpen] = useState(false)

  const daySchedule = useTimetableDay(childId, selectedDay)
  const periods = useMemo(() => daySchedule?.periods ?? [], [daySchedule])
  const showCurrentPeriod = selectedDay === resolveDefaultDay(today) && today.day() >= 1 && today.day() <= 5

  function handleSelectPeriod(period: Period) {
    setSelectedPeriod(period)
    setSheetOpen(true)
  }

  function handleOpenChange(open: boolean) {
    setSheetOpen(open)
    if (!open) {
      setSelectedPeriod(null)
    }
  }

  return (
    <section className="timetable-section">
      <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      <PeriodList
        periods={periods}
        showCurrentPeriod={showCurrentPeriod}
        onSelectPeriod={handleSelectPeriod}
      />
      <PeriodDetailsSheet period={selectedPeriod} isOpen={isSheetOpen} onOpenChange={handleOpenChange} />
    </section>
  )
}

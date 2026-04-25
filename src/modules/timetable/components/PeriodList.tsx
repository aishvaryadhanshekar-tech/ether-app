import { BreakRow } from "@/modules/timetable/components/BreakRow"
import { PeriodCard } from "@/modules/timetable/components/PeriodCard"
import type { Period } from "@/modules/timetable/types"

interface PeriodListProps {
  periods: Period[]
  showCurrentPeriod: boolean
  onSelectPeriod: (period: Period) => void
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

export function PeriodList({ periods, showCurrentPeriod, onSelectPeriod }: PeriodListProps) {
  if (periods.length === 0) {
    return <p className="timetable-empty-state">Timetable not published yet</p>
  }

  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  return (
    <div className="timetable-period-list">
      {periods.map((period) => {
        const isCurrent =
          showCurrentPeriod &&
          !period.isBreak &&
          nowMinutes >= toMinutes(period.startTime) &&
          nowMinutes < toMinutes(period.endTime)

        return period.isBreak ? (
          <BreakRow key={period.id} period={period} />
        ) : (
          <PeriodCard
            key={period.id}
            period={period}
            isCurrent={isCurrent}
            onSelectPeriod={onSelectPeriod}
          />
        )
      })}
    </div>
  )
}

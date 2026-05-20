import type {
  Period,
  TimetableDay,
  TimetableDayName,
} from "@/modules/timetable/types";

interface WeekViewProps {
  weekDays: TimetableDay[];
  todayDay: TimetableDayName;
  isWeekdayToday: boolean;
  onSelectPeriod: (period: Period) => void;
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTimeDisplay(time: string) {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes}`;
}

const dayLabelMap: Record<TimetableDayName, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
};

interface TimeSlot {
  time: string;
  minutes: number;
}

interface PeriodCell {
  period: Period;
  isCurrent: boolean;
  isBreak: boolean;
}

export function WeekView({
  weekDays,
  todayDay,
  isWeekdayToday,
  onSelectPeriod,
}: WeekViewProps) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const slots = new Set<number>();
  weekDays.forEach((day) => {
    day.periods.forEach((period) => {
      slots.add(toMinutes(period.startTime));
    });
  });

  const sortedSlots = Array.from(slots).sort((a, b) => a - b);
  const timeSlots: TimeSlot[] = sortedSlots.map((mins) => {
    const hours = Math.floor(mins / 60);
    const minsPart = mins % 60;
    const time = `${String(hours).padStart(2, "0")}:${String(minsPart).padStart(2, "0")}`;
    return { time, minutes: mins };
  });

  // Get all periods for a specific day and time slot
  const getPeriodsForSlot = (
    dayName: TimetableDayName,
    slotMinutes: number,
  ): PeriodCell[] => {
    const day = weekDays.find((d) => d.day === dayName);
    if (!day) return [];

    return day.periods
      .filter((period) => toMinutes(period.startTime) === slotMinutes)
      .map((period) => {
        const isCurrent =
          isWeekdayToday &&
          dayName === todayDay &&
          !period.isBreak &&
          nowMinutes >= toMinutes(period.startTime) &&
          nowMinutes < toMinutes(period.endTime);

        return {
          period,
          isCurrent,
          isBreak: !!period.isBreak,
        };
      });
  };

  const isCurrentTimeInView = (() => {
    if (!isWeekdayToday) return null;

    for (let index = 0; index < timeSlots.length; index += 1) {
      const slot = timeSlots[index];
      const nextSlot = timeSlots[index + 1];
      const endTime = nextSlot ? nextSlot.minutes : slot.minutes + 60;
      if (nowMinutes >= slot.minutes && nowMinutes < endTime) {
        return {
          slotMinutes: slot.minutes,
          offsetPercent:
            ((nowMinutes - slot.minutes) / (endTime - slot.minutes)) * 100,
        };
      }
    }

    return null;
  })();

  if (weekDays.length === 0) {
    return <p className="timetable-empty-state">Timetable not published yet</p>;
  }

  return (
    <div className="timetable-week-container">
      <div className="timetable-week-grid-wrapper">
        <div className="timetable-week-grid">
          <div className="timetable-week-grid-header">
            <div className="timetable-week-grid-time-column-header" />
            {weekDays.map((day) => {
              const isToday = isWeekdayToday && day.day === todayDay;
              return (
                <div
                  key={day.day}
                  className="timetable-week-grid-day-header"
                  data-day={day.day}
                  data-is-today={isToday}
                >
                  <div className="timetable-week-grid-day-label-wrapper">
                    <div className="timetable-week-grid-day-label">
                      {dayLabelMap[day.day]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="timetable-week-grid-rows">
            {timeSlots.map((slot) => {
              return (
                <div key={slot.minutes} className="timetable-week-grid-row">
                  <div className="timetable-week-grid-time-column">
                    <div className="timetable-week-grid-time-label">
                      {formatTimeDisplay(slot.time)}
                    </div>
                  </div>

                  {weekDays.map((day) => {
                    const cells = getPeriodsForSlot(day.day, slot.minutes);
                    const isToday = isWeekdayToday && day.day === todayDay;

                    return (
                      <div
                        key={`${day.day}-${slot.minutes}`}
                        className="timetable-week-grid-cell"
                        data-day={day.day}
                        data-is-today={isToday}
                      >
                        {cells.map((cell) => (
                          <div
                            key={cell.period.id}
                            className="timetable-week-period-card"
                            data-current={cell.isCurrent}
                            data-is-break={cell.isBreak}
                            onClick={() => onSelectPeriod(cell.period)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                onSelectPeriod(cell.period);
                              }
                            }}
                          >
                            {!cell.isBreak ? (
                              <div className="timetable-week-period-subject">
                                {cell.period.subject}
                              </div>
                            ) : (
                              <div className="timetable-week-break-label">
                                {cell.period.subject}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}

                  {isCurrentTimeInView?.slotMinutes === slot.minutes && (
                    <div
                      className="timetable-week-current-time-indicator"
                      style={{
                        top: `${isCurrentTimeInView.offsetPercent}%`,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

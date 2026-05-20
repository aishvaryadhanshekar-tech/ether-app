import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { CalendarCheck, Download } from "lucide-react";
import { Button } from "@/design-system/components/Button";
import { DaySelector } from "@/modules/timetable/components/DaySelector";
import { PeriodDetailsSheet } from "@/modules/timetable/components/PeriodDetailsSheet";
import { PeriodList } from "@/modules/timetable/components/PeriodList";
import { TimetableViewToggle } from "@/modules/timetable/components/TimetableViewToggle";
import { WeekView } from "@/modules/timetable/components/WeekView";
import { openWeekTimetablePrintView } from "@/modules/timetable/print";
import {
  useTimetableDay,
  useTimetableWeek,
} from "@/modules/timetable/selectors";
import type { Period, TimetableDayName } from "@/modules/timetable/types";
import { useAppStore } from "@/store/rootStore";

interface TimetableSectionProps {
  childId: string;
}

function resolveDefaultDay(today: dayjs.Dayjs): TimetableDayName {
  const index = today.day();
  const dayByIndex: Record<number, TimetableDayName> = {
    1: "mon",
    2: "tue",
    3: "wed",
    4: "thu",
    5: "fri",
  };
  return dayByIndex[index] ?? "mon";
}

const dayItems: Array<{ value: TimetableDayName; label: string }> = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
];

export function TimetableSection({ childId }: TimetableSectionProps) {
  const today = dayjs();
  const isWeekdayToday = today.day() >= 1 && today.day() <= 5;
  const todayDay = resolveDefaultDay(today);
  const [viewMode, setViewMode] = useState<"day" | "week">(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(min-width: 768px)").matches ? "week" : "day";
    }
    return "day";
  });
  const [selectedDay, setSelectedDay] = useState<TimetableDayName>(
    () => todayDay,
  );
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);

  const daySchedule = useTimetableDay(childId, selectedDay);
  const weekSchedule = useTimetableWeek(childId);
  const childName = useAppStore(
    (state) => state.children[childId]?.name ?? "Student",
  );
  const periods = useMemo(() => daySchedule?.periods ?? [], [daySchedule]);
  const weekDays = useMemo(() => weekSchedule?.days ?? [], [weekSchedule]);
  const hasWeekData = useMemo(
    () => weekDays.some((day) => day.periods.length > 0),
    [weekDays],
  );
  const showCurrentPeriod = selectedDay === todayDay && isWeekdayToday;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = (event: MediaQueryListEvent) => {
      setViewMode(event.matches ? "week" : "day");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  function handleViewModeChange(nextMode: "day" | "week") {
    setViewMode(nextMode);
    setSelectedPeriod(null);
  }

  function handleSelectPeriod(period: Period) {
    setSelectedPeriod(period);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setSelectedPeriod(null);
    }
  }

  function handleDownloadPdf() {
    openWeekTimetablePrintView({
      childName,
      weekDays,
      weekStartDate: weekSchedule?.weekStartDate,
    });
  }

  return (
    <section className="timetable-section">
      <TimetableViewToggle value={viewMode} onChange={handleViewModeChange} />
      {viewMode === "day" ? (
        <>
          <DaySelector
            selectedValue={selectedDay}
            onSelectValue={setSelectedDay}
            items={dayItems}
            ariaLabel="Weekday filter"
          />
          <PeriodList
            periods={periods}
            showCurrentPeriod={showCurrentPeriod}
            onSelectPeriod={handleSelectPeriod}
          />
        </>
      ) : (
        <>
          <WeekView
            weekDays={weekDays}
            todayDay={todayDay}
            isWeekdayToday={isWeekdayToday}
            onSelectPeriod={handleSelectPeriod}
          />
          {hasWeekData ? (
            <div className="timetable-week-actions">
              <div className="timetable-week-actions-copy">
                <CalendarCheck
                  className="timetable-week-actions-icon"
                  aria-hidden="true"
                />
                <div>
                  <p className="timetable-week-actions-eyebrow">
                    Make school mornings easier
                  </p>
                  <p className="timetable-week-actions-note">
                    Your child's routine, in one glance.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDownloadPdf}
              >
                <Download aria-hidden="true" />
                Download PDF
              </Button>
            </div>
          ) : null}
        </>
      )}
      <PeriodDetailsSheet
        period={selectedPeriod}
        isOpen={selectedPeriod !== null}
        onOpenChange={handleOpenChange}
      />
    </section>
  );
}

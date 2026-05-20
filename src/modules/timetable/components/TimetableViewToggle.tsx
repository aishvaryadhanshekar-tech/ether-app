interface TimetableViewToggleProps {
  value: "day" | "week";
  onChange: (value: "day" | "week") => void;
}

export function TimetableViewToggle({
  value,
  onChange,
}: TimetableViewToggleProps) {
  return (
    <div
      className="timetable-view-toggle"
      role="tablist"
      aria-label="Timetable view selector"
    >
      <button
        type="button"
        role="tab"
        aria-selected={value === "day"}
        className="timetable-view-toggle-item"
        data-active={value === "day"}
        onClick={() => onChange("day")}
      >
        Day
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === "week"}
        className="timetable-view-toggle-item"
        data-active={value === "week"}
        onClick={() => onChange("week")}
      >
        Week
      </button>
    </div>
  );
}

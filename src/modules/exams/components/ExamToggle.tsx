interface ExamToggleProps {
  value: "upcoming" | "results"
  onChange: (value: "upcoming" | "results") => void
}

export function ExamToggle({ value, onChange }: ExamToggleProps) {
  return (
    <div className="exams-toggle" role="tablist" aria-label="Exams view selector">
      <button
        type="button"
        role="tab"
        aria-selected={value === "upcoming"}
        className="exams-toggle-item"
        data-active={value === "upcoming"}
        onClick={() => onChange("upcoming")}
      >
        Upcoming
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === "results"}
        className="exams-toggle-item"
        data-active={value === "results"}
        onClick={() => onChange("results")}
      >
        Results
      </button>
    </div>
  )
}

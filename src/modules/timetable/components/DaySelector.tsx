export interface DaySelectorItem<T extends string> {
  value: T
  label: string
}

interface DaySelectorProps<T extends string> {
  selectedValue: T
  onSelectValue: (value: T) => void
  items: DaySelectorItem<T>[]
  ariaLabel: string
  variant?: "underline" | "subtle"
}

export function DaySelector<T extends string>({
  selectedValue,
  onSelectValue,
  items,
  ariaLabel,
  variant = "underline",
}: DaySelectorProps<T>) {
  return (
    <div className="timetable-day-selector" data-variant={variant} aria-label={ariaLabel}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          aria-pressed={selectedValue === item.value}
          className="timetable-day-filter"
          data-variant={variant}
          data-active={selectedValue === item.value ? "true" : "false"}
          onClick={() => onSelectValue(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

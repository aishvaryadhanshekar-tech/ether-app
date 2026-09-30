import { useEffect, useRef, useState, type ReactNode } from "react"
import { Check, ChevronDown } from "lucide-react"

export interface FilterDropdownChipItem<T extends string> {
  value: T
  label: string
  icon?: ReactNode
}

interface FilterDropdownChipProps<T extends string> {
  value: T
  items: FilterDropdownChipItem<T>[]
  onChange: (value: T) => void
  ariaLabel: string
  icon?: ReactNode
}

export function FilterDropdownChip<T extends string>({
  value,
  items,
  onChange,
  ariaLabel,
  icon,
}: FilterDropdownChipProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const selectedItem = items.find((item) => item.value === value) ?? items[0]

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("touchstart", handlePointerDown)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("touchstart", handlePointerDown)
    }
  }, [isOpen])

  function selectValue(nextValue: T) {
    onChange(nextValue)
    setIsOpen(false)
  }

  return (
    <div className="filter-dropdown-chip" ref={rootRef}>
      <button
        type="button"
        className="filter-dropdown-chip-trigger"
        data-open={isOpen ? "true" : "false"}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        {icon ?? selectedItem.icon ? (
          <span className="filter-dropdown-chip-icon" aria-hidden>
            {icon ?? selectedItem.icon}
          </span>
        ) : null}
        <span className="filter-dropdown-chip-label">{selectedItem.label}</span>
        <ChevronDown className="filter-dropdown-chip-chevron" aria-hidden />
      </button>

      {isOpen ? (
        <div className="filter-dropdown-chip-menu" role="listbox" aria-label={ariaLabel}>
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              role="option"
              aria-selected={item.value === value}
              className="filter-dropdown-chip-option"
              data-selected={item.value === value ? "true" : "false"}
              onClick={() => selectValue(item.value)}
            >
              {item.icon ? (
                <span className="filter-dropdown-chip-option-icon" aria-hidden>
                  {item.icon}
                </span>
              ) : null}
              <span className="filter-dropdown-chip-option-label">{item.label}</span>
              {item.value === value ? (
                <Check className="filter-dropdown-chip-check" aria-hidden />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

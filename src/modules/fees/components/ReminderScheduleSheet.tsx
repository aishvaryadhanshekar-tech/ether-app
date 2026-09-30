import { useEffect, useState } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface ReminderScheduleSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirmReminder: (reminderText: string) => void
}

const reminderOptions = [
  "Tomorrow",
  "In 3 days",
  "In 1 week",
  "Pick a date",
]

export function ReminderScheduleSheet({
  isOpen,
  onOpenChange,
  onConfirmReminder,
}: ReminderScheduleSheetProps) {
  const [selectedOption, setSelectedOption] = useState(reminderOptions[0])
  const [selectedDate, setSelectedDate] = useState("")

  useEffect(() => {
    if (isOpen) {
      setSelectedOption(reminderOptions[0])
      setSelectedDate(new Date().toISOString().slice(0, 10))
    }
  }, [isOpen])

  function handleConfirm() {
    const reminderText =
      selectedOption === "Pick a date"
        ? `Reminder on ${selectedDate}`
        : selectedOption
    onConfirmReminder(reminderText)
    onOpenChange(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="fees-reminder-sheet">
        <div className="attendance-sheet-grabber" />

        <div className="fees-reminder-header">
          <div>
            <h3 className="fees-reminder-title">Set a fee reminder</h3>
            <p className="fees-reminder-copy">
              Choose when you want us to remind you about this upcoming fee.
            </p>
          </div>
        </div>

        <fieldset className="fees-payment-fieldset">
          <legend className="fees-payment-label">Reminder timing</legend>
          <div className="fees-payment-options">
            {reminderOptions.map((option) => (
              <label key={option} className="fees-payment-option">
                <input
                  type="radio"
                  name="reminder-time"
                  checked={selectedOption === option}
                  onChange={() => setSelectedOption(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {selectedOption === "Pick a date" ? (
          <div className="fees-reminder-date-picker">
            <label className="fees-payment-label" htmlFor="reminder-date">
              Select date
            </label>
            <input
              id="reminder-date"
              type="date"
              className="fees-reminder-date-input"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </div>
        ) : null}

        <div className="fees-reminder-actions">
          <button
            type="button"
            className="fees-payment-secondary fees-reminder-cancel"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="fees-payment-submit fees-reminder-confirm"
            onClick={handleConfirm}
          >
            Set reminder
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

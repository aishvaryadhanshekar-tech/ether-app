import { useMemo } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/design-system/components/Button"
import type { AttendanceEntry } from "@/modules/attendance/types"

interface AttendanceBottomSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: string
  entry?: AttendanceEntry
  note: string
  onChangeNote: (value: string) => void
  onSubmitNote: () => void
}

function getPeriodCount(entry?: AttendanceEntry) {
  if (!entry || entry.status === "absent" || entry.status === "holiday") {
    return 0
  }
  return entry.periodsPresent ?? 1
}

export function AttendanceBottomSheet({
  isOpen,
  onOpenChange,
  selectedDate,
  entry,
  note,
  onChangeNote,
  onSubmitNote,
}: AttendanceBottomSheetProps) {
  const periodCount = useMemo(() => getPeriodCount(entry), [entry])
  const submittedNote = entry?.absentNote?.note ?? entry?.note
  const statusLabel = (entry?.status ?? "not_marked").replace("_", " ")

  if (!selectedDate) {
    return null
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <div className="attendance-sheet-grabber" />
        <div className="attendance-sheet-body">
          <h3 className="attendance-sheet-title">Attendance Details</h3>
          <div className="attendance-sheet-grid-two">
            <div className="attendance-sheet-data-card">
              <p className="attendance-sheet-label">Date</p>
              <p className="attendance-sheet-value attendance-sheet-value-break">{selectedDate}</p>
            </div>
            <div className="attendance-sheet-data-card">
              <p className="attendance-sheet-label">Status</p>
              <p className="attendance-sheet-value attendance-sheet-capitalize">{statusLabel}</p>
            </div>
          </div>
          <div className="attendance-sheet-data-card">
            <p className="attendance-sheet-label">Marked Time</p>
            <p className="attendance-sheet-value attendance-sheet-value-break">{entry?.markedAt ?? "Not yet marked"}</p>
          </div>

          <div className="attendance-sheet-data-card">
            <p className="attendance-sheet-label">Period Count</p>
            <p className="attendance-sheet-value">{periodCount}</p>
          </div>

          {!entry ? <p className="attendance-sheet-warning">Attendance not yet marked.</p> : null}

          {entry?.status === "absent" && !submittedNote ? (
            <div className="attendance-sheet-note-editor">
              <p className="attendance-sheet-note-copy">Add a note for this absence.</p>
              <Textarea
                value={note}
                onChange={(event) => onChangeNote(event.target.value)}
                placeholder="Reason for absence"
              />
              <Button type="button" onClick={onSubmitNote} disabled={!note.trim()}>
                Add Note
              </Button>
            </div>
          ) : null}

          {submittedNote ? (
            <div className="attendance-sheet-data-card">
              <p className="attendance-sheet-label">Absence note</p>
              <p className="attendance-sheet-submitted-note">{submittedNote}</p>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}

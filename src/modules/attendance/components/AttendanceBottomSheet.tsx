import { useMemo } from "react"
import { Button } from "@/design-system/components/Button"
import { Sheet } from "@/design-system/components/Sheet"
import type { AttendanceEntry } from "@/modules/attendance/types"

interface AttendanceBottomSheetProps {
  isOpen: boolean
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
  return 1
}

export function AttendanceBottomSheet({
  isOpen,
  selectedDate,
  entry,
  note,
  onChangeNote,
  onSubmitNote,
}: AttendanceBottomSheetProps) {
  const periodCount = useMemo(() => getPeriodCount(entry), [entry])

  if (!isOpen || !selectedDate) {
    return null
  }

  return (
    <Sheet title="Attendance Details" className="mt-4">
      <div className="space-y-3 text-sm">
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted">Date</p>
          <p className="font-medium text-foreground">{selectedDate}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-border bg-white p-3">
            <p className="text-xs text-muted">Marked Time</p>
            <p className="font-medium text-foreground">{entry?.markedAt ?? "Not yet marked"}</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-3">
            <p className="text-xs text-muted">Period Count</p>
            <p className="font-medium text-foreground">{periodCount}</p>
          </div>
        </div>

        {!entry ? <p className="text-sm text-amber-700">Attendance not yet marked.</p> : null}

        {entry?.status === "absent" && !entry.note ? (
          <div className="space-y-2 rounded-lg border border-border bg-white p-3">
            <p className="text-sm text-muted">Add a note for this absence.</p>
            <textarea
              value={note}
              onChange={(event) => onChangeNote(event.target.value)}
              placeholder="Reason for absence"
              className="h-24 w-full rounded-md border border-border p-2 text-sm"
            />
            <Button type="button" onClick={onSubmitNote} disabled={!note.trim()}>
              Add Note
            </Button>
          </div>
        ) : null}

        {entry?.note ? (
          <div className="rounded-lg border border-border bg-white p-3">
            <p className="text-xs text-muted">Submitted Note</p>
            <p className="mt-1 text-sm text-foreground">{entry.note}</p>
          </div>
        ) : null}
      </div>
    </Sheet>
  )
}

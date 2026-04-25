import { useMemo } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
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
      <SheetContent side="bottom" className="rounded-t-3xl px-4 pb-[calc(1.75rem+env(safe-area-inset-bottom))] pt-5">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />
        <div className="space-y-3 text-sm">
          <h3 className="text-base font-semibold text-foreground">Attendance Details</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-border bg-white p-3">
              <p className="text-xs text-muted">Date</p>
              <p className="font-medium text-foreground">{selectedDate}</p>
            </div>
            <div className="rounded-lg border border-border bg-white p-3">
              <p className="text-xs text-muted">Status</p>
              <p className="font-medium capitalize text-foreground">{statusLabel}</p>
            </div>
            <div className="rounded-lg border border-border bg-white p-3">
              <p className="text-xs text-muted">Marked Time</p>
              <p className="font-medium text-foreground">{entry?.markedAt ?? "Not yet marked"}</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-3">
            <p className="text-xs text-muted">Period Count</p>
            <p className="font-medium text-foreground">{periodCount}</p>
          </div>

          {!entry ? <p className="text-sm text-amber-700">Attendance not yet marked.</p> : null}

          {entry?.status === "absent" && !submittedNote ? (
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

          {submittedNote ? (
            <div className="rounded-lg border border-border bg-white p-3">
              <p className="text-xs text-muted">Submitted Note</p>
              <p className="mt-1 text-sm text-foreground">{submittedNote}</p>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}

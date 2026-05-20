import { Sheet, SheetContent } from "@/components/ui/sheet"
import type { Badge } from "@/modules/badges/types"
import { formatDateLabel } from "@/shared/utils/format"

interface BadgeDetailsSheetProps {
  badge: Badge | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function BadgeDetailsSheet({ badge, isOpen, onOpenChange }: BadgeDetailsSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        {badge ? (
          <>
            <div className="attendance-sheet-grabber" />
            <div className="attendance-sheet-body">
              <div className="badge-sheet-hero">
                <div className="badge-sheet-icon" data-tone={badge.tone ?? "sun"} aria-hidden="true">
                  <span className="badge-sheet-icon-glyph">{badge.icon}</span>
                </div>
                <div>
                  <h3 className="attendance-sheet-title">{badge.title}</h3>
                  <p className="badge-sheet-subtitle">A celebratory note for your child.</p>
                </div>
              </div>

              <div className="attendance-sheet-grid-two">
                <div className="attendance-sheet-data-card">
                  <p className="attendance-sheet-label">Awarded by</p>
                  <p className="attendance-sheet-value">{badge.awardedBy.teacherName}</p>
                </div>
                <div className="attendance-sheet-data-card">
                  <p className="attendance-sheet-label">Role</p>
                  <p className="attendance-sheet-value">{badge.awardedBy.role}</p>
                </div>
              </div>

              <div className="attendance-sheet-data-card">
                <p className="attendance-sheet-label">Date</p>
                <p className="attendance-sheet-value">{formatDateLabel(badge.awardedAt)}</p>
              </div>

              {badge.comment ? (
                <div className="attendance-sheet-data-card">
                  <p className="attendance-sheet-label">Teacher comment</p>
                  <p className="badge-sheet-comment">“{badge.comment}”</p>
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

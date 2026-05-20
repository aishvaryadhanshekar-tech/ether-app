import type { Badge } from "@/modules/badges/types"
import { formatDateLabel } from "@/shared/utils/format"

interface BadgeCardProps {
  badge: Badge
  onSelectBadge: (badge: Badge) => void
}

export function BadgeCard({ badge, onSelectBadge }: BadgeCardProps) {
  const commentPreview = badge.comment?.trim()

  return (
    <button
      type="button"
      className="badge-card"
      onClick={() => onSelectBadge(badge)}
      aria-label={`Open badge details for ${badge.title}`}
    >
      <div className="badge-card-icon" data-tone={badge.tone ?? "sun"} aria-hidden="true">
        <span className="badge-card-icon-glyph">{badge.icon}</span>
      </div>
      <div className="badge-card-content">
        <div className="badge-card-header">
          <div>
            <h3 className="badge-card-title">{badge.title}</h3>
            <p className="badge-card-meta">
              Awarded by {badge.awardedBy.teacherName}, {badge.awardedBy.role}
            </p>
          </div>
          <p className="badge-card-date">{formatDateLabel(badge.awardedAt)}</p>
        </div>
        {commentPreview ? (
          <p className="badge-card-comment-preview">“{commentPreview}”</p>
        ) : null}
      </div>
    </button>
  )
}

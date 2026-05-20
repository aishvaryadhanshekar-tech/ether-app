import dayjs from "dayjs"

interface ExamListCardProps {
  date: string
  title: string
  byline?: string
  rightPrimary: string
  rightSecondary?: string
  chipLabel?: string
  rightPrimaryAsCta?: boolean
  onClick: () => void
}

export function ExamListCard({
  date,
  title,
  byline,
  rightPrimary,
  rightSecondary,
  chipLabel,
  rightPrimaryAsCta = false,
  onClick,
}: ExamListCardProps) {
  return (
    <button type="button" className="exam-list-card" onClick={onClick}>
      <div className="exam-list-card-main">
        <div className="exam-list-card-left">
          <p className="exam-list-card-date">{dayjs(date).format("MMM D")}</p>
        </div>

        <div className="exam-list-card-middle">
          <p className="exam-list-card-title">{title}</p>
          {byline ? <p className="exam-list-card-byline">{byline}</p> : null}
        </div>

        <div className="exam-list-card-right">
          {chipLabel ? <span className="exam-list-card-chip">{chipLabel}</span> : null}
          <p className={rightPrimaryAsCta ? "exam-list-card-right-primary cta" : "exam-list-card-right-primary"}>
            {rightPrimary}
          </p>
          {rightSecondary ? <p className="exam-list-card-right-secondary">{rightSecondary}</p> : null}
        </div>
      </div>
    </button>
  )
}

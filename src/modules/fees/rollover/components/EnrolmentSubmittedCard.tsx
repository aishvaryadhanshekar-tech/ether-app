import { CheckCircle2, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface EnrolmentSubmittedCardProps {
  childId: string
}

export function EnrolmentSubmittedCard({ childId }: EnrolmentSubmittedCardProps) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      className="enrolment-submitted-card"
      onClick={() => navigate(`/fees/rollover/${childId}`)}
    >
      <span className="enrolment-submitted-icon" aria-hidden>
        <CheckCircle2 size={20} />
      </span>
      <span className="enrolment-submitted-copy">
        <span className="enrolment-submitted-title">Rollover submitted</span>
        <span className="enrolment-submitted-subtitle">
          View family and student details for 2026–2027
        </span>
      </span>
      <ChevronRight className="enrolment-submitted-chevron" aria-hidden />
    </button>
  )
}

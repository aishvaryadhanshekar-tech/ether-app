import { useNavigate } from "react-router-dom"
import { getFirstName } from "@/modules/fees/utils"
import { useAppStore } from "@/store/rootStore"

interface RolloverIntroCardProps {
  childId: string
  childName: string
}

function EnrolmentIllustration() {
  return (
    <svg
      className="rollover-intro-art"
      viewBox="0 0 240 148"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="12" y="22" width="216" height="108" rx="24" fill="#F3E8FF" />
      <rect x="28" y="16" width="88" height="116" rx="12" fill="white" stroke="#D8B4FE" strokeWidth="1.4" />
      <rect x="42" y="30" width="44" height="8" rx="4" fill="#C084FC" />
      <circle cx="46" cy="54" r="5" fill="#EDE9FE" />
      <path d="M44 54.2l1.6 1.6 3.4-3.6" stroke="#7C3AED" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="56" y="50" width="42" height="6" rx="3" fill="#E9D5FF" />
      <circle cx="46" cy="72" r="5" fill="#EDE9FE" />
      <path d="M44 72.2l1.6 1.6 3.4-3.6" stroke="#7C3AED" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="56" y="68" width="36" height="6" rx="3" fill="#E9D5FF" />
      <circle cx="46" cy="90" r="5" fill="none" stroke="#D8B4FE" strokeWidth="1.4" />
      <rect x="56" y="86" width="40" height="6" rx="3" fill="#F3E8FF" />
      <rect x="42" y="108" width="60" height="10" rx="5" fill="#C084FC" />
      <path
        d="M128 74h16"
        stroke="#8B5CF6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M140 68l6 6-6 6"
        stroke="#8B5CF6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="154" y="28" width="58" height="92" rx="12" fill="white" stroke="#D8B4FE" strokeWidth="1.4" />
      <rect x="154" y="28" width="58" height="26" rx="12" fill="#7C3AED" />
      <rect x="154" y="42" width="58" height="12" fill="#7C3AED" />
      <text x="183" y="46" textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">
        2026–27
      </text>
      <rect x="166" y="64" width="10" height="10" rx="2" fill="#F3E8FF" />
      <rect x="180" y="64" width="10" height="10" rx="2" fill="#F3E8FF" />
      <rect x="194" y="64" width="10" height="10" rx="2" fill="#F3E8FF" />
      <rect x="166" y="80" width="10" height="10" rx="2" fill="#F3E8FF" />
      <rect x="180" y="80" width="10" height="10" rx="2" fill="#7C3AED" />
      <rect x="194" y="80" width="10" height="10" rx="2" fill="#F3E8FF" />
      <rect x="166" y="96" width="10" height="10" rx="2" fill="#F3E8FF" />
      <rect x="180" y="96" width="10" height="10" rx="2" fill="#F3E8FF" />
    </svg>
  )
}

export function RolloverIntroCard({ childId, childName }: RolloverIntroCardProps) {
  const navigate = useNavigate()
  const firstName = getFirstName(childName)
  const isDraft = useAppStore((state) => state.rolloverDraftChildIds.includes(childId))

  return (
    <article className="rollover-intro-card">
      <EnrolmentIllustration />
      <h3 className="rollover-intro-title">Rollover for the Year 2026–2027</h3>
      <p className="rollover-intro-copy">
        Review details and declarations for {firstName}.
      </p>
      <button
        type="button"
        className="rollover-intro-cta"
        onClick={() => navigate(`/fees/rollover/${childId}`)}
      >
        {isDraft ? "Continue rollover" : "Start rollover"}
      </button>
    </article>
  )
}

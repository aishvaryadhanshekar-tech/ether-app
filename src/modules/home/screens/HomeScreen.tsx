import { ArrowRight, Clock3, CreditCard } from "lucide-react"
import { Link } from "react-router-dom"
import { useAppStore } from "@/store/rootStore"

function HomeWireframe({ size }: { size: "large" | "medium" | "small" }) {
  return <div className={`home-wireframe-card home-wireframe-card-${size}`} aria-hidden />
}

export function HomeScreen() {
  const fees = useAppStore((state) => state.fees)
  const children = useAppStore((state) => state.children)
  const rolloverCompletedChildIds = useAppStore((state) => state.rolloverCompletedChildIds)
  const hasOutstanding = Object.values(fees?.childBalancesPaise ?? {}).some(
    (balance) => balance > 0,
  )
  const hasEnrolmentPending = Object.keys(children).some(
    (childId) => !rolloverCompletedChildIds.includes(childId),
  )
  const statusLabel = hasEnrolmentPending
    ? "Rollover pending"
    : hasOutstanding
      ? "Payment due"
      : "View payment details"
  const showAlert = hasEnrolmentPending || hasOutstanding
  const ariaLabel = hasEnrolmentPending
    ? "Fees and payments — rollover pending"
    : hasOutstanding
      ? "Fees and payments — payment due"
      : "View fees and payments"

  return (
    <section className="home-screen">
      <HomeWireframe size="large" />

      <Link to="/fees" className="home-fees-card" aria-label={ariaLabel}>
        <span className="home-fees-icon" aria-hidden>
          <CreditCard />
          {showAlert ? <span className="home-fees-status-dot" /> : null}
        </span>
        <span className="home-fees-copy">
          <span className="home-fees-title">Fees &amp; Payments</span>
          <span
            className={
              showAlert ? "home-fees-description home-fees-description-due" : "home-fees-description"
            }
          >
            {showAlert ? <Clock3 aria-hidden /> : null}
            {statusLabel}
          </span>
        </span>
        <ArrowRight className="home-fees-arrow" aria-hidden />
      </Link>

      <HomeWireframe size="medium" />
      <HomeWireframe size="small" />
    </section>
  )
}

import { useEffect, useState } from "react"
import { CalendarClock, CheckCircle2, Clock3, BellRing } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { PaymentDetailsSheet } from "@/modules/fees/components/PaymentDetailsSheet"
import { PaymentGatewaySheet } from "@/modules/fees/components/PaymentGatewaySheet"
import { PaymentSheet } from "@/modules/fees/components/PaymentSheet"
import { PaymentSuccessSheet } from "@/modules/fees/components/PaymentSuccessSheet"
import { PdfReceiptModal } from "@/modules/fees/components/PdfReceiptModal"
import { ReminderScheduleSheet } from "@/modules/fees/components/ReminderScheduleSheet"
import { TransactionList } from "@/modules/fees/components/TransactionList"
import { RolloverIntroCard } from "@/modules/fees/rollover/components/RolloverIntroCard"
import { EnrolmentSubmittedCard } from "@/modules/fees/rollover/components/EnrolmentSubmittedCard"
import type { PaymentTransaction } from "@/modules/fees/types"
import {
  formatDueInDaysLabel,
  formatFeeAmount,
  formatFeeDueDate,
  getChildBalancePaise,
  getFirstName,
  getTermBreakdownGroups,
  installmentPlanKey,
} from "@/modules/fees/utils"
import { PageTitle } from "@/shared/components/PageTitle"
import { useActiveChild } from "@/shared/hooks/useActiveChild"
import { useAppStore } from "@/store/rootStore"

const PAYMENT_HISTORY_HASH = "#payment-history"

export function FeesScreen() {
  const { activeChildId } = useActiveChild()

  // Keyed by child so open sheets and history filters reset when the parent switches child.
  return <FeesChildView key={activeChildId} selectedChildId={activeChildId} />
}

function FeesChildView({ selectedChildId }: { selectedChildId: string }) {
  const navigate = useNavigate()
  const location = useLocation()
  const fees = useAppStore((state) => state.fees)
  const transactions = useAppStore((state) => state.transactions)
  const children = useAppStore((state) => state.children)
  const recordFeePayment = useAppStore((state) => state.recordFeePayment)
  const rolloverCompletedChildIds = useAppStore((state) => state.rolloverCompletedChildIds)
  const installmentStartedKeys = useAppStore((state) => state.installmentStartedKeys)
  const installmentDueDateByChild = useAppStore((state) => state.installmentDueDateByChild)

  const [isPaymentOpen, setPaymentOpen] = useState(false)
  const [isGatewayOpen, setGatewayOpen] = useState(false)
  const [pendingPayment, setPendingPayment] = useState<{
    childIds: string[]
    amountPaise: number
    isInstallment: boolean
  } | null>(null)
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null)
  const [isDetailsOpen, setDetailsOpen] = useState(false)
  const [receiptTx, setReceiptTx] = useState<PaymentTransaction | null>(null)
  const [isPdfOpen, setPdfOpen] = useState(false)
  const [isSuccessOpen, setSuccessOpen] = useState(false)
  const [successSummary, setSuccessSummary] = useState<{
    amountPaise: number
    selectedChildNames: string
  } | null>(null)
  const [isReminderOpen, setReminderOpen] = useState(false)
  const [historyFilterResetKey, setHistoryFilterResetKey] = useState(0)

  function handleReminderConfirm(reminderText: string) {
    console.log("Reminder scheduled:", reminderText)
  }

  function scrollToPaymentHistory() {
    window.requestAnimationFrame(() => {
      document
        .getElementById("fees-payment-history")
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  function routeToPaymentHistory() {
    navigate({ pathname: "/fees", hash: "payment-history" }, { replace: true })
    setHistoryFilterResetKey((key) => key + 1)
    scrollToPaymentHistory()
  }

  useEffect(() => {
    if (location.hash === PAYMENT_HISTORY_HASH) {
      scrollToPaymentHistory()
    }
  }, [location.hash, transactions.length])

  const currentBalancePaise = getChildBalancePaise(fees?.childBalancesPaise, selectedChildId)
  const selectedChild = children[selectedChildId]
  const selectedChildName = selectedChild?.name ?? "Student"
  const paymentChild = {
    id: selectedChildId,
    name: selectedChildName,
    balancePaise: currentBalancePaise,
    grade: selectedChild ? `${selectedChild.class}-${selectedChild.section}` : undefined,
  }
  const breakdownGroups = getTermBreakdownGroups(fees, selectedChildId)
  const isInstallmentPending = installmentStartedKeys.includes(
    installmentPlanKey(selectedChildId, "current"),
  )
  const effectiveDueDate =
    installmentDueDateByChild[selectedChildId] ?? fees?.dueDate ?? ""

  if (!fees) {
    return (
      <section className="fees-screen">
        <PageTitle>Fees</PageTitle>
        <p className="fees-loading">Loading fee details...</p>
      </section>
    )
  }

  const isPaid = currentBalancePaise === 0
  const isRolloverComplete = rolloverCompletedChildIds.includes(selectedChildId)
  const cardState = isPaid ? "paid" : isInstallmentPending ? "upcoming" : "due"
  const statusLabel = isPaid
    ? "All dues paid"
    : isInstallmentPending
      ? "Upcoming"
      : formatDueInDaysLabel(effectiveDueDate)

  function handleSelectTransaction(tx: PaymentTransaction) {
    setSelectedTx(tx)
    setDetailsOpen(true)
  }

  function handleViewReceipt(tx: PaymentTransaction) {
    setReceiptTx(tx)
    setPdfOpen(true)
  }

  function handlePaymentSuccess(amountPaise: number, selectedChildIds: string[]) {
    const selectedNames = selectedChildIds
      .map((childId) => children[childId]?.name ?? "Student")
      .join(", ")

    setSuccessSummary({ amountPaise, selectedChildNames: selectedNames })
    setSuccessOpen(true)
  }

  function handleSuccessDone() {
    routeToPaymentHistory()
  }

  return (
    <section className="fees-screen">
      <PageTitle>Fees &amp; Payments</PageTitle>

      {isRolloverComplete ? (
        <div className="fees-summary-card" data-state={cardState}>
          <div className="fees-summary-header">
            <p className="fees-summary-period">
              {getFirstName(selectedChildName)} · {fees.termLabel.replace(/^Term \d+\s+/i, "")}
            </p>
            <span className="fees-status-pill" data-state={cardState}>
              {isPaid ? (
                <CheckCircle2 aria-hidden />
              ) : isInstallmentPending ? (
                <CalendarClock aria-hidden />
              ) : (
                <Clock3 aria-hidden />
              )}
              {statusLabel}
            </span>
          </div>

          {isPaid ? (
            <div className="fees-paid-content">
              <p className="fees-summary-kicker">Amount due</p>
              <p className="fees-summary-amount">{formatFeeAmount(currentBalancePaise)}</p>
              <p className="fees-paid-copy">Your fees for this period are fully settled.</p>
            </div>
          ) : (
            <>
              <div className="fees-summary-outstanding">
                <span className="fees-summary-kicker">
                  Amount due
                  <span className="fees-summary-kicker-date">
                    {" "}· by {formatFeeDueDate(effectiveDueDate)}
                  </span>
                </span>
                <div className="fees-summary-outstanding-bottom">
                  <div className="fees-summary-amount-block">
                    <p className="fees-summary-amount">{formatFeeAmount(currentBalancePaise)}</p>
                  </div>
                </div>
              </div>

              <div className="fees-summary-actions">
                <button
                  type="button"
                  className="fees-pay-now"
                  data-variant={isInstallmentPending ? "outline" : "primary"}
                  onClick={() => setPaymentOpen(true)}
                >
                  {isInstallmentPending ? "Review & pay early" : "Review & Pay"}
                </button>
                <button
                  type="button"
                  className="fees-reminder-btn"
                  onClick={() => setReminderOpen(true)}
                  aria-label="Set a reminder"
                >
                  <BellRing size={18} aria-hidden />
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <RolloverIntroCard
          childId={selectedChildId}
          childName={children[selectedChildId]?.name ?? "Student"}
        />
      )}

      {isRolloverComplete ? <EnrolmentSubmittedCard childId={selectedChildId} /> : null}

      <TransactionList
        transactions={transactions}
        childId={selectedChildId}
        filterResetKey={historyFilterResetKey}
        onSelectTransaction={handleSelectTransaction}
      />

      <PaymentSheet
        isOpen={isPaymentOpen}
        onOpenChange={setPaymentOpen}
        child={paymentChild}
        termLabel={fees.termLabel}
        breakdownGroups={breakdownGroups}
        canSplitInstallment={!isInstallmentPending}
        onContinue={(selectedChildIds, amountPaise, isInstallment) => {
          setPendingPayment({ childIds: selectedChildIds, amountPaise, isInstallment })
          setGatewayOpen(true)
        }}
      />

      <PaymentGatewaySheet
        isOpen={isGatewayOpen}
        onOpenChange={setGatewayOpen}
        amountPaise={pendingPayment?.amountPaise ?? 0}
        childName={selectedChildName}
        onPay={() => {
          if (!pendingPayment) {
            return
          }
          recordFeePayment(
            pendingPayment.childIds,
            pendingPayment.amountPaise,
            "upi",
            "current",
            pendingPayment.isInstallment,
          )
          handlePaymentSuccess(pendingPayment.amountPaise, pendingPayment.childIds)
          setGatewayOpen(false)
          setPendingPayment(null)
        }}
      />

      <PaymentSuccessSheet
        isOpen={isSuccessOpen}
        onOpenChange={setSuccessOpen}
        amountPaise={successSummary?.amountPaise ?? 0}
        selectedChildNames={successSummary?.selectedChildNames ?? "Selected students"}
        onDone={handleSuccessDone}
      />

      <ReminderScheduleSheet
        isOpen={isReminderOpen}
        onOpenChange={setReminderOpen}
        onConfirmReminder={handleReminderConfirm}
      />

      <PaymentDetailsSheet
        transaction={selectedTx}
        isOpen={isDetailsOpen}
        onOpenChange={setDetailsOpen}
        onViewReceipt={handleViewReceipt}
      />

      <PdfReceiptModal
        transaction={receiptTx}
        isOpen={isPdfOpen}
        onOpenChange={setPdfOpen}
      />
    </section>
  )
}

import { useEffect, useState } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { FeeBreakdownList } from "@/modules/fees/components/FeeBreakdownList"
import type { FeeBreakdownGroup } from "@/modules/fees/types"
import { formatFeeAmount, getChildInitial, getInstallmentAmounts } from "@/modules/fees/utils"

interface FeeChildOption {
  id: string
  name: string
  balancePaise: number
  grade?: string
}

interface PaymentSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  child: FeeChildOption | null
  termLabel: string
  breakdownGroups: FeeBreakdownGroup[]
  canSplitInstallment: boolean
  onContinue: (selectedChildIds: string[], amountPaise: number, isInstallment: boolean) => void
}

type PayMode = "full" | "installment"

export function PaymentSheet({
  isOpen,
  onOpenChange,
  child,
  termLabel,
  breakdownGroups,
  canSplitInstallment,
  onContinue,
}: PaymentSheetProps) {
  const [mode, setMode] = useState<PayMode>("full")
  const balance = child?.balancePaise ?? 0
  const { firstPaise, secondPaise } = getInstallmentAmounts(balance)
  const showSplit = canSplitInstallment && firstPaise > 0 && secondPaise > 0
  const isInstallment = mode === "installment" && showSplit
  const payAmount = isInstallment ? firstPaise : balance
  const canPay = Boolean(child && payAmount > 0)

  useEffect(() => {
    if (isOpen) {
      setMode("full")
    }
  }, [isOpen])

  function handleContinue() {
    if (!child || payAmount <= 0) {
      return
    }
    onContinue([child.id], payAmount, isInstallment)
    onOpenChange(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="fees-payment-sheet">
        <div className="attendance-sheet-grabber" />
        <div className="fees-payment-header">
          <h3 className="fees-payment-title">Review payment</h3>
          {child ? (
            <div className="fees-payment-student">
              <span className="fees-tx-avatar" data-child={child.id} aria-hidden>
                {getChildInitial(child.name)}
              </span>
              <span className="fees-payment-student-copy">
                <span className="fees-payment-student-name">{child.name}</span>
                <span className="fees-payment-student-meta">
                  {child.grade ? `${child.grade} · ` : ""}
                  {termLabel}
                </span>
              </span>
            </div>
          ) : (
            <p className="fees-payment-copy">Review the fee details.</p>
          )}
        </div>

        <div className="fees-payment-body">
          {showSplit ? (
            <fieldset className="fees-payment-plan">
              <legend className="fees-payment-plan-legend">Select a payment plan</legend>
              <label className="fees-payment-plan-option" data-selected={mode === "full" ? "true" : "false"}>
                <input
                  type="radio"
                  name="fee-pay-plan"
                  checked={mode === "full"}
                  onChange={() => setMode("full")}
                />
                <span className="fees-payment-plan-copy">
                  <span className="fees-payment-plan-title">Pay in full</span>
                  <span className="fees-payment-plan-meta">One-time payment</span>
                </span>
              </label>
              <label
                className="fees-payment-plan-option"
                data-selected={mode === "installment" ? "true" : "false"}
              >
                <input
                  type="radio"
                  name="fee-pay-plan"
                  checked={mode === "installment"}
                  onChange={() => setMode("installment")}
                />
                <span className="fees-payment-plan-copy">
                  <span className="fees-payment-plan-title">Pay in 2 installments</span>
                  <span className="fees-payment-plan-meta">
                    {formatFeeAmount(firstPaise)} now, {formatFeeAmount(secondPaise)} later
                  </span>
                </span>
              </label>
            </fieldset>
          ) : null}

          {child ? (
            <section className="fees-payment-breakdown" aria-label="Fee breakdown">
              <h4 className="fees-payment-breakdown-title">Fee breakdown</h4>
              <FeeBreakdownList groups={breakdownGroups} balancePaise={balance} />
            </section>
          ) : (
            <p className="fees-payment-copy">No payable balances for this term.</p>
          )}
        </div>

        <div className="fees-payment-footer">
          <div className="fees-payment-total-row">
            <span>Paying now</span>
            <strong>{formatFeeAmount(payAmount)}</strong>
          </div>

          <div className="fees-payment-cta-row">
            <button
              type="button"
              className="fees-payment-secondary fees-payment-cta"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="fees-payment-submit fees-payment-cta"
              disabled={!canPay}
              onClick={handleContinue}
            >
              Continue to pay
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

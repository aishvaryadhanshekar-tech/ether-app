import { CreditCard, FileText, Landmark, Smartphone, X } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import type { PaymentMethod, PaymentTransaction } from "@/modules/fees/types"
import { formatFeeAmount } from "@/modules/fees/utils"

interface PaymentDetailsSheetProps {
  transaction: PaymentTransaction | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onViewReceipt: (transaction: PaymentTransaction) => void
}

const methodIcons: Record<PaymentMethod, typeof Smartphone> = {
  upi: Smartphone,
  card: CreditCard,
  net_banking: Landmark,
}

function formatFullDateTime(isoString: string) {
  try {
    const d = new Date(isoString)
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d)
  } catch {
    return isoString
  }
}

export function PaymentDetailsSheet({
  transaction,
  isOpen,
  onOpenChange,
  onViewReceipt,
}: PaymentDetailsSheetProps) {
  if (!transaction) return null

  const MethodIcon = methodIcons[transaction.paymentMethod] || Smartphone

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="fees-details-sheet">
        <div className="attendance-sheet-grabber" />

        <div className="fees-details-header">
          <div className="fees-details-header-title">
            <h3>Payment Details</h3>
          </div>
          <button
            type="button"
            className="fees-details-close"
            onClick={() => onOpenChange(false)}
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>

        <div className="fees-details-body">
          {/* Hero Amount Display */}
          <div className="fees-details-hero">
            <div className="fees-details-icon-wrapper">
              <MethodIcon className="fees-details-hero-icon" aria-hidden />
            </div>
            <p className="fees-details-hero-label">Total Amount Paid</p>
            <p className="fees-details-hero-amount">{formatFeeAmount(transaction.amountPaise)}</p>
            <p className="fees-details-hero-date">{formatFullDateTime(transaction.date)}</p>
          </div>

          <div className="fees-details-card">
            <h4 className="fees-card-heading">Transaction Details</h4>
            <div className="fees-details-grid">
              <div className="fees-detail-row">
                <span className="fees-detail-label">Transaction ID</span>
                <span className="fees-detail-value font-mono">{transaction.id}</span>
              </div>
              <div className="fees-detail-row">
                <span className="fees-detail-label">Payment Method</span>
                <span className="fees-detail-value">{transaction.paymentMethodDetails}</span>
              </div>
              <div className="fees-detail-row">
                <span className="fees-detail-label">Paid by</span>
                <span className="fees-detail-value">{transaction.paidBy}</span>
              </div>
              <div className="fees-detail-row">
                <span className="fees-detail-label">Student</span>
                <span className="fees-detail-value">{transaction.childName}</span>
              </div>
              <div className="fees-detail-row">
                <span className="fees-detail-label">Category / Term</span>
                <span className="fees-detail-value">{transaction.termLabel}</span>
              </div>
            </div>
          </div>

          {transaction.breakdown && transaction.breakdown.length > 0 ? (
            <div className="fees-breakdown-details">
              <div className="fees-breakdown-summary">
                <span>Itemised breakdown</span>
              </div>
              <div className="fees-breakdown-list">
                {transaction.breakdown.map((item, idx) => (
                  <div key={idx} className="fees-breakdown-row">
                    <span className="fees-breakdown-item">{item.category}</span>
                    <span className="fees-breakdown-amount">{formatFeeAmount(item.amountPaise)}</span>
                  </div>
                ))}
                <div className="fees-breakdown-row fees-breakdown-total">
                  <span>Total Settled</span>
                  <span>{formatFeeAmount(transaction.amountPaise)}</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Download Receipt / Cancel Actions */}
          <div className="fees-details-actions fees-details-actions-row">
            <button
              type="button"
              className="fees-download-receipt-btn"
              onClick={() => onViewReceipt(transaction)}
            >
              <FileText size={18} aria-hidden />
              <span>Download Receipt</span>
            </button>
            <button
              type="button"
              className="fees-details-cancel-btn"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

import { CheckCircle2, FileText } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { formatFeeAmount } from "@/modules/fees/utils"

interface PaymentSuccessSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  amountPaise: number
  selectedChildNames: string
  onDone?: () => void
}

export function PaymentSuccessSheet({
  isOpen,
  onOpenChange,
  amountPaise,
  selectedChildNames,
  onDone,
}: PaymentSuccessSheetProps) {
  function handleDone() {
    onOpenChange(false)
    onDone?.()
  }

  function handleDownloadReceipt() {
    const receiptText = [
      "Fee Payment Receipt",
      `Date: ${new Date().toLocaleString("en-IN")}`,
      `Amount Paid: ${formatFeeAmount(amountPaise)}`,
      `Students: ${selectedChildNames}`,
      "Status: Successful",
    ].join("\n")

    const blob = new Blob([receiptText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `fee-receipt-${Date.now()}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="fees-payment-success-sheet">
        <div className="attendance-sheet-grabber" />
        <div className="fees-payment-success-card">
          <CheckCircle2 className="fees-payment-success-icon" aria-hidden />
          <h3 className="fees-payment-success-title">Payment successful</h3>
          <p className="fees-payment-success-copy">
            {formatFeeAmount(amountPaise)} has been paid for {selectedChildNames}.
          </p>
          <div className="fees-payment-success-actions">
            <button
              type="button"
              className="fees-payment-submit fees-payment-secondary"
              onClick={handleDone}
            >
              Done
            </button>
            <button type="button" className="fees-payment-submit" onClick={handleDownloadReceipt}>
              <FileText size={16} aria-hidden />
              <span>Download receipt</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

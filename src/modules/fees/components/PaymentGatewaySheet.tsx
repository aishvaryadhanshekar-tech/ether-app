import { useEffect, useRef } from "react"
import { LoaderCircle } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { formatFeeAmount } from "@/modules/fees/utils"

const PROCESSING_MS = 2500

interface PaymentGatewaySheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  amountPaise: number
  childName: string
  onPay: () => void
}

export function PaymentGatewaySheet({
  isOpen,
  onOpenChange,
  amountPaise,
  childName,
  onPay,
}: PaymentGatewaySheetProps) {
  const onPayRef = useRef(onPay)
  onPayRef.current = onPay

  useEffect(() => {
    if (!isOpen || amountPaise <= 0) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      onPayRef.current()
    }, PROCESSING_MS)

    return () => window.clearTimeout(timeoutId)
  }, [isOpen, amountPaise])

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="fees-payment-success-sheet">
        <div className="attendance-sheet-grabber" />
        <div className="fees-payment-success-card">
          <LoaderCircle className="fees-payment-processing-icon" aria-hidden />
          <h3 className="fees-payment-success-title">Processing payment</h3>
          <p className="fees-payment-success-copy">
            Paying {formatFeeAmount(amountPaise)} for {childName}. Please wait.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

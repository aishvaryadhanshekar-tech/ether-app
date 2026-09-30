import { useState } from "react"
import { Check, Download, GraduationCap, Share2, ShieldCheck, X } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import type { PaymentTransaction } from "@/modules/fees/types"
import { formatFeeAmount } from "@/modules/fees/utils"

interface PdfReceiptModalProps {
  transaction: PaymentTransaction | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

function formatDateOnly(isoString: string) {
  try {
    const d = new Date(isoString)
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d)
  } catch {
    return isoString
  }
}

function convertNumberToWords(amountPaise: number): string {
  const rupees = Math.floor(amountPaise / 100)
  if (rupees === 22500) return "Twenty-Two Thousand Five Hundred Rupees Only"
  if (rupees === 18000) return "Eighteen Thousand Rupees Only"
  if (rupees === 12000) return "Twelve Thousand Rupees Only"
  if (rupees === 20000) return "Twenty Thousand Rupees Only"
  return `${rupees.toLocaleString("en-IN")} Rupees Only`
}

export function PdfReceiptModal({
  transaction,
  isOpen,
  onOpenChange,
}: PdfReceiptModalProps) {
  const [copied, setCopied] = useState(false)

  if (!transaction) return null

  function handleDownload() {
    window.print()
  }

  async function handleShare() {
    const shareText = `Fee Payment Receipt #${transaction?.receiptNumber}\nStudent: ${transaction?.childName}\nTerm: ${transaction?.termLabel}\nAmount Paid: ${formatFeeAmount(transaction?.amountPaise ?? 0)}\nStatus: Successful`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receipt ${transaction?.receiptNumber}`,
          text: shareText,
        })
      } catch {
        // Fallback to copy if user cancels or share API fails
        copyToClipboard(shareText)
      }
    } else {
      copyToClipboard(shareText)
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="fees-pdf-sheet">
        <div className="attendance-sheet-grabber" />

        {/* Modal Action Bar */}
        <div className="fees-pdf-actionbar">
          <div className="fees-pdf-actionbar-title">
            <span>Official Receipt</span>
            <span className="fees-pdf-tag">{transaction.receiptNumber}</span>
          </div>

          <div className="fees-pdf-actions">
            <button
              type="button"
              className="fees-pdf-action-btn"
              onClick={handleDownload}
              title="Download / Print Receipt"
            >
              <Download size={16} aria-hidden />
              <span>Download</span>
            </button>

            <button
              type="button"
              className="fees-pdf-action-btn"
              onClick={handleShare}
              title="Share Receipt"
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>

            <button
              type="button"
              className="fees-pdf-close-btn"
              onClick={() => onOpenChange(false)}
              aria-label="Close PDF viewer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Document Container */}
        <div className="fees-pdf-document-scroll">
          <div className="fees-pdf-document" id="printable-receipt">
            {/* Watermark */}
            <div className="fees-pdf-watermark">ETHER SCHOOL</div>

            {/* Receipt Top Header */}
            <div className="fees-pdf-header">
              <div className="fees-pdf-brand">
                <div className="fees-pdf-logo">
                  <GraduationCap size={28} />
                </div>
                <div>
                  <h2 className="fees-pdf-school-name">ETHER INTERNATIONAL SCHOOL</h2>
                  <p className="fees-pdf-school-sub">Affiliated to CBSE • Code: 89302</p>
                  <p className="fees-pdf-school-address">124 Knowledge Park, Sector 42, Bengaluru, 560001</p>
                </div>
              </div>
              <div className="fees-pdf-stamp-verified">
                <ShieldCheck size={16} />
                <span>PAID &amp; VERIFIED</span>
              </div>
            </div>

            <div className="fees-pdf-divider" />

            {/* Document Title */}
            <div className="fees-pdf-title-block">
              <h3 className="fees-pdf-title">FEE PAYMENT RECEIPT</h3>
              <p className="fees-pdf-receipt-no">Receipt No: <strong>{transaction.receiptNumber}</strong></p>
            </div>

            {/* Metadata Table Grid */}
            <div className="fees-pdf-meta-grid">
              <div className="fees-pdf-meta-col">
                <p><span>Student Name:</span> <strong>{transaction.childName}</strong></p>
                <p><span>Term / Academic Year:</span> <strong>{transaction.termLabel}</strong></p>
                <p><span>Paid By:</span> <strong>{transaction.paidBy}</strong></p>
              </div>
              <div className="fees-pdf-meta-col">
                <p><span>Date of Payment:</span> <strong>{formatDateOnly(transaction.date)}</strong></p>
                <p><span>Payment Mode:</span> <strong>{transaction.paymentMethodDetails}</strong></p>
                <p><span>Status:</span> <strong className="text-emerald-600">SUCCESSFUL</strong></p>
              </div>
            </div>

            {/* Itemized Line Table */}
            <table className="fees-pdf-table">
              <thead>
                <tr>
                  <th className="w-12">#</th>
                  <th>Description / Fee Head</th>
                  <th className="text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                {transaction.breakdown && transaction.breakdown.length > 0 ? (
                  transaction.breakdown.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.category}</td>
                      <td className="text-right font-medium">{formatFeeAmount(item.amountPaise)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>1</td>
                    <td>{transaction.termLabel} Payment</td>
                    <td className="text-right font-medium">{formatFeeAmount(transaction.amountPaise)}</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} className="text-right font-bold">Total Paid:</td>
                  <td className="text-right font-bold text-base">{formatFeeAmount(transaction.amountPaise)}</td>
                </tr>
              </tfoot>
            </table>

            {/* Amount in Words */}
            <div className="fees-pdf-words font-mono">
              <span>Amount in words: </span>
              <strong>{convertNumberToWords(transaction.amountPaise)}</strong>
            </div>

            {/* Signatures & Footer */}
            <div className="fees-pdf-footer">
              <div className="fees-pdf-note">
                <p>* This is a system-generated electronic receipt valid without signature.</p>
                <p>* For tax exemption queries, contact accounts@etherschool.edu</p>
              </div>

              <div className="fees-pdf-sign-box">
                <div className="fees-pdf-signature-graphic">Ether Accounts</div>
                <div className="fees-pdf-sign-title">Authorized Signatory</div>
                <div className="fees-pdf-sign-sub">Ether International School</div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

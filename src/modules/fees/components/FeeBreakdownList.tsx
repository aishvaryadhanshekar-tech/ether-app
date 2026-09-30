import type { FeeBreakdownGroup } from "@/modules/fees/types"
import { formatFeeAmount, sumGroups } from "@/modules/fees/utils"

interface FeeBreakdownListProps {
  groups: FeeBreakdownGroup[]
  balancePaise: number
}

/** Flat line items + term summary, shown in the review & pay sheet. */
export function FeeBreakdownList({ groups, balancePaise }: FeeBreakdownListProps) {
  const items = groups.flatMap((group) => group.items)
  const termTotalPaise = sumGroups(groups)
  const paidPaise = Math.max(termTotalPaise - balancePaise, 0)

  return (
    <div className="fees-breakdown-list">
      {items.length === 0 ? (
        <p className="fees-breakdown-empty">No line items available for this term.</p>
      ) : (
        <ul className="fees-breakdown-items">
          {items.map((item) => (
            <li key={item.id} className="fees-breakdown-item">
              <span className="fees-breakdown-item-copy">
                <span>{item.label}</span>
                {item.note ? <span className="fees-breakdown-item-note">{item.note}</span> : null}
              </span>
              <span className="fees-breakdown-item-amount">{formatFeeAmount(item.amountPaise)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="fees-breakdown-summary">
        {paidPaise > 0 ? (
          <>
            <div className="fees-breakdown-summary-row">
              <span>Term total</span>
              <strong>{formatFeeAmount(termTotalPaise)}</strong>
            </div>
            <div className="fees-breakdown-summary-row" data-tone="paid">
              <span>Paid</span>
              <strong>−{formatFeeAmount(paidPaise)}</strong>
            </div>
          </>
        ) : null}
        <div className="fees-breakdown-summary-row fees-breakdown-summary-total">
          <span>{paidPaise > 0 ? "Remaining" : "Total due"}</span>
          <strong>{formatFeeAmount(balancePaise)}</strong>
        </div>
      </div>
    </div>
  )
}

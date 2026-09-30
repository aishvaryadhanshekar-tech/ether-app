import { useEffect, useMemo, useState } from "react"
import {
  ChevronRight,
  Filter,
  RotateCcw,
  X,
} from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import type { PaymentTransaction } from "@/modules/fees/types"
import { formatFeeAmount, getChildInitial, getFirstName } from "@/modules/fees/utils"

interface TransactionListProps {
  transactions: PaymentTransaction[]
  childId: string
  onSelectTransaction: (transaction: PaymentTransaction) => void
  filterResetKey?: number
}

function formatDate(isoString: string) {
  try {
    const d = new Date(isoString)
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d)
  } catch {
    return isoString
  }
}

export function TransactionList({
  transactions,
  childId,
  onSelectTransaction,
  filterResetKey = 0,
}: TransactionListProps) {
  const [selectedTermFilter, setSelectedTermFilter] = useState<string>("all")
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all")
  const [selectedStartDate, setSelectedStartDate] = useState<string>("")
  const [selectedEndDate, setSelectedEndDate] = useState<string>("")

  const [tempTermFilter, setTempTermFilter] = useState<string>("all")
  const [tempCategoryFilter, setTempCategoryFilter] = useState<string>("all")
  const [tempStartDate, setTempStartDate] = useState<string>("")
  const [tempEndDate, setTempEndDate] = useState<string>("")
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false)

  useEffect(() => {
    if (filterResetKey > 0) {
      setSelectedTermFilter("all")
      setSelectedCategoryFilter("all")
      setSelectedStartDate("")
      setSelectedEndDate("")
    }
  }, [filterResetKey])

  const childTransactions = useMemo(
    () => transactions.filter((tx) => tx.childId === childId),
    [transactions, childId],
  )

  const uniqueTerms = useMemo(() => {
    const terms = new Set<string>()
    childTransactions.forEach((tx) => {
      if (tx.termLabel) {
        terms.add(tx.termLabel)
      }
    })
    return Array.from(terms).sort((a, b) => a.localeCompare(b))
  }, [childTransactions])

  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>()
    childTransactions.forEach((tx) => {
      tx.breakdown.forEach((item) => {
        if (item.category) categories.add(item.category)
      })
    })
    return Array.from(categories).sort((a, b) => a.localeCompare(b))
  }, [childTransactions])

  const activeFilterCount =
    (selectedTermFilter !== "all" ? 1 : 0) +
    (selectedCategoryFilter !== "all" ? 1 : 0) +
    (selectedStartDate ? 1 : 0) +
    (selectedEndDate ? 1 : 0)

  function openFilterSheet() {
    setTempTermFilter(selectedTermFilter)
    setTempCategoryFilter(selectedCategoryFilter)
    setTempStartDate(selectedStartDate)
    setTempEndDate(selectedEndDate)
    setFilterSheetOpen(true)
  }

  function applyFilters() {
    setSelectedTermFilter(tempTermFilter)
    setSelectedCategoryFilter(tempCategoryFilter)
    setSelectedStartDate(tempStartDate)
    setSelectedEndDate(tempEndDate)
    setFilterSheetOpen(false)
  }

  function resetFilters() {
    setTempTermFilter("all")
    setTempCategoryFilter("all")
    setTempStartDate("")
    setTempEndDate("")
  }

  function clearAllActiveFilters() {
    setSelectedTermFilter("all")
    setSelectedCategoryFilter("all")
    setSelectedStartDate("")
    setSelectedEndDate("")
  }

  const filteredTransactions = useMemo(() => {
    return childTransactions.filter((tx) => {
      if (selectedTermFilter !== "all" && tx.termLabel !== selectedTermFilter) {
        return false
      }

      if (selectedCategoryFilter !== "all") {
        const categoryMatches = tx.breakdown.some(
          (item) => item.category === selectedCategoryFilter,
        )
        if (!categoryMatches) return false
      }

      if (selectedStartDate) {
        const txDate = new Date(tx.date).toISOString().slice(0, 10)
        if (txDate < selectedStartDate) return false
      }
      if (selectedEndDate) {
        const txDate = new Date(tx.date).toISOString().slice(0, 10)
        if (txDate > selectedEndDate) return false
      }

      return true
    })
  }, [
    childTransactions,
    selectedTermFilter,
    selectedCategoryFilter,
    selectedStartDate,
    selectedEndDate,
  ])

  return (
    <div id="fees-payment-history" className="fees-transactions-container">
      <div className="fees-transactions-header">
        <h3 className="fees-transactions-title">Payment History</h3>

        <button
          type="button"
          className="fees-filter-btn"
          data-active={activeFilterCount > 0}
          onClick={openFilterSheet}
          aria-label="Filter transactions"
        >
          <Filter size={16} aria-hidden />
          {activeFilterCount > 0 ? (
            <span className="fees-filter-badge">{activeFilterCount}</span>
          ) : null}
        </button>
      </div>

      {activeFilterCount > 0 ? (
        <div className="fees-active-filters-bar">
          {selectedTermFilter !== "all" ? (
            <span className="fees-active-chip">
              Term: {selectedTermFilter}
              <button type="button" onClick={() => setSelectedTermFilter("all")} aria-label="Clear term filter">
                <X size={12} />
              </button>
            </span>
          ) : null}

          {selectedCategoryFilter !== "all" ? (
            <span className="fees-active-chip">
              Category: {selectedCategoryFilter}
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter("all")}
                aria-label="Clear category filter"
              >
                <X size={12} />
              </button>
            </span>
          ) : null}

          {selectedStartDate ? (
            <span className="fees-active-chip">
              From: {selectedStartDate}
              <button type="button" onClick={() => setSelectedStartDate("")} aria-label="Clear start date">
                <X size={12} />
              </button>
            </span>
          ) : null}

          {selectedEndDate ? (
            <span className="fees-active-chip">
              To: {selectedEndDate}
              <button type="button" onClick={() => setSelectedEndDate("")} aria-label="Clear end date">
                <X size={12} />
              </button>
            </span>
          ) : null}

          <button type="button" className="fees-clear-all-btn" onClick={clearAllActiveFilters}>
            Clear all
          </button>
        </div>
      ) : null}

      {filteredTransactions.length === 0 ? (
        <div className="fees-transactions-empty">
          <p className="fees-empty-title">No transactions found</p>
          <p className="fees-empty-desc">Try resetting your applied filters.</p>
          <button type="button" className="fees-reset-btn" onClick={clearAllActiveFilters}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="fees-transaction-list">
          {filteredTransactions.map((tx) => (
            <button
              key={tx.id}
              type="button"
              className="fees-transaction-card"
              onClick={() => onSelectTransaction(tx)}
            >
              <div className="fees-tx-avatar" data-child={tx.childId}>
                {getChildInitial(tx.childName)}
              </div>

              <div className="fees-tx-main">
                <h4 className="fees-tx-title">{tx.termLabel}</h4>
                <div className="fees-tx-meta-row">
                  <span className="fees-tx-child-name">{getFirstName(tx.childName)}</span>
                  <span className="fees-tx-dot">•</span>
                  <span className="fees-tx-date">{formatDate(tx.date)}</span>
                </div>
              </div>

              <div className="fees-tx-end">
                <span className="fees-tx-amount">{formatFeeAmount(tx.amountPaise)}</span>
                <ChevronRight className="fees-tx-arrow" aria-hidden />
              </div>
            </button>
          ))}
        </div>
      )}

      <Sheet open={isFilterSheetOpen} onOpenChange={setFilterSheetOpen}>
        <SheetContent side="bottom" className="fees-filter-sheet">
          <div className="attendance-sheet-grabber" />

          <div className="fees-filter-sheet-header">
            <h3 className="fees-filter-sheet-title">Filter Transactions</h3>
            <button
              type="button"
              className="fees-details-close"
              onClick={() => setFilterSheetOpen(false)}
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          </div>

          <div className="fees-filter-sheet-body">
            {uniqueTerms.length > 0 ? (
              <div className="fees-filter-group">
                <label className="fees-filter-group-label">Term</label>
                <div className="fees-filter-options-grid">
                  <button
                    type="button"
                    className="fees-filter-option-btn"
                    data-selected={tempTermFilter === "all"}
                    onClick={() => setTempTermFilter("all")}
                  >
                    <span>All Terms</span>
                  </button>
                  {uniqueTerms.map((term) => (
                    <button
                      key={term}
                      type="button"
                      className="fees-filter-option-btn"
                      data-selected={tempTermFilter === term}
                      onClick={() => setTempTermFilter(term)}
                    >
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {uniqueCategories.length > 0 ? (
              <div className="fees-filter-group">
                <label className="fees-filter-group-label">Category</label>
                <div className="fees-filter-options-grid">
                  <button
                    type="button"
                    className="fees-filter-option-btn"
                    data-selected={tempCategoryFilter === "all"}
                    onClick={() => setTempCategoryFilter("all")}
                  >
                    <span>All Categories</span>
                  </button>
                  {uniqueCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className="fees-filter-option-btn"
                      data-selected={tempCategoryFilter === category}
                      onClick={() => setTempCategoryFilter(category)}
                    >
                      <span>{category}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="fees-filter-group">
              <label className="fees-filter-group-label">Date</label>
              <div className="fees-filter-date-grid">
                <label className="fees-date-field">
                  <span className="fees-date-label">From</span>
                  <input
                    type="date"
                    value={tempStartDate}
                    onChange={(event) => setTempStartDate(event.target.value)}
                    className="fees-date-input"
                  />
                </label>
                <label className="fees-date-field">
                  <span className="fees-date-label">To</span>
                  <input
                    type="date"
                    value={tempEndDate}
                    onChange={(event) => setTempEndDate(event.target.value)}
                    className="fees-date-input"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="fees-filter-sheet-footer">
            <button type="button" className="fees-filter-reset-btn" onClick={resetFilters}>
              <RotateCcw size={15} aria-hidden />
              <span>Reset</span>
            </button>
            <button type="button" className="fees-filter-apply-btn" onClick={applyFilters}>
              Apply
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

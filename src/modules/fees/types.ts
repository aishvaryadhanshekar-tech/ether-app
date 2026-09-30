export type PaymentMethod = "upi" | "card" | "net_banking"

export type PaymentTarget = "all" | string

export interface FeeBreakdownItem {
  category: string
  amountPaise: number
}

export interface OutstandingBreakdownItem {
  category: string
  amountPaise: number
}

export interface FeeLineItem {
  id: string
  label: string
  amountPaise: number
  note?: string
}

export interface FeeBreakdownGroup {
  id: string
  label: string
  items: FeeLineItem[]
}

export interface PaymentTransaction {
  id: string
  receiptNumber: string
  childId: string
  childName: string
  termLabel: string
  amountPaise: number
  date: string
  paymentMethod: PaymentMethod
  paymentMethodDetails: string
  paidBy: string
  status: "successful" | "pending" | "failed"
  breakdown: FeeBreakdownItem[]
}

export interface UpcomingFeeSummary {
  termLabel: string
  dueDate: string
  dueDateText: string
  childBalancesPaise: Record<string, number>
  outstandingBreakdown: Record<string, OutstandingBreakdownItem[]>
  /** Original term fees per child, grouped. Never mutated by payments. */
  termBreakdown?: Record<string, FeeBreakdownGroup[]>
}

export interface FeeSummary {
  termLabel: string
  dueDate: string
  childBalancesPaise: Record<string, number>
  outstandingBreakdown: Record<string, OutstandingBreakdownItem[]>
  /** Original term fees per child, grouped. Never mutated by payments. */
  termBreakdown?: Record<string, FeeBreakdownGroup[]>
  upcoming: UpcomingFeeSummary
}

export type FeePaymentTarget = "current" | "upcoming"


import type {
  FeeBreakdownGroup,
  FeePaymentTarget,
  FeeSummary,
  UpcomingFeeSummary,
} from "@/modules/fees/types"

export function getChildBalancePaise(
  balances: Record<string, number> | undefined,
  childId: string,
) {
  return balances?.[childId] ?? 0
}

export function getChildInitial(name: string) {
  return (name.trim().charAt(0) || "S").toUpperCase()
}

export function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || "Student"
}

export function getInstallmentAmounts(balancePaise: number) {
  const firstPaise = Math.floor(balancePaise / 2)
  return {
    firstPaise,
    secondPaise: balancePaise - firstPaise,
  }
}

export function installmentPlanKey(childId: string, target: FeePaymentTarget = "current") {
  return `${childId}:${target}`
}

export function addDaysToIsoDate(isoDate: string, days: number) {
  const [year, month, day] = isoDate.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + days)
  const yyyy = date.getUTCFullYear()
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(date.getUTCDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

export function formatDueInDaysLabel(isoDate: string, now = new Date()) {
  const [year, month, day] = isoDate.split("-").map(Number)
  const dueUtc = Date.UTC(year, month - 1, day)
  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  const diffDays = Math.round((dueUtc - todayUtc) / 86_400_000)

  if (diffDays < 0) {
    const overdue = Math.abs(diffDays)
    return overdue === 1 ? "Overdue by 1 day" : `Overdue by ${overdue} days`
  }
  if (diffDays === 0) {
    return "Due today"
  }
  if (diffDays === 1) {
    return "Due in 1 day"
  }
  return `Due in ${diffDays} days`
}

export function formatFeeAmount(amountPaise: number) {
  const fractionDigits = amountPaise % 100 === 0 ? 0 : 2
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amountPaise / 100)
}

export function parseRupeesToPaise(value: string) {
  const match = value.trim().match(/^(\d+)(?:\.(\d{1,2}))?$/)
  if (!match) {
    return null
  }

  const rupees = Number(match[1])
  const paise = Number((match[2] ?? "").padEnd(2, "0"))
  return rupees * 100 + paise
}

export function formatFeeDueDate(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

export function getTermBreakdownGroups(
  fees: Pick<FeeSummary | UpcomingFeeSummary, "termBreakdown" | "outstandingBreakdown"> | null,
  childId: string,
): FeeBreakdownGroup[] {
  const groups = fees?.termBreakdown?.[childId]
  if (groups && groups.length > 0) {
    return groups
  }

  return (fees?.outstandingBreakdown[childId] ?? []).map((item, index) => ({
    id: `${childId}-group-${index}`,
    label: item.category,
    items: [{ id: `${childId}-item-${index}`, label: item.category, amountPaise: item.amountPaise }],
  }))
}

export function sumGroup(group: FeeBreakdownGroup) {
  return group.items.reduce((sum, item) => sum + item.amountPaise, 0)
}

export function sumGroups(groups: FeeBreakdownGroup[]) {
  return groups.reduce((sum, group) => sum + sumGroup(group), 0)
}

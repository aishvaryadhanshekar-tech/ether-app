import { generateSeedData } from "@/db/generators"
import { attendanceService } from "@/services/attendance.service"
import { examsService } from "@/services/exams.service"
import type { PaymentTransaction } from "@/modules/fees/types"
import { useAppStore } from "@/store/rootStore"

let hasSeeded = false

const TERM_ALIASES: Record<string, string> = {
  "Annual Activity & Transport Fee": "Annual Fees 2025-2026",
}

const CATEGORY_ALIASES: Record<string, string> = {
  "Tuition Fee - Grade 6": "Tuition Fee",
  "Tuition Fee - Grade 5": "Tuition Fee",
  "Tuition Fee - Grade 3": "Tuition Fee",
  "Computer & Science Lab Fee": "Activity Fee",
  "Library & Digital Resources": "Activity Fee",
  "Art & Activity Kit Charges": "Activity Fee",
  "Development Fund": "Stationery & Resources",
  "Annual Sports Meet & Uniform": "Activity Fee",
  "School Bus Transport (Q4)": "Transport Fee",
  "Exams & Evaluation Charges": "Activity Fee",
  "Activity & Lab Charges": "Activity Fee",
}

function sanitizeCategory(category: string) {
  if (CATEGORY_ALIASES[category]) {
    return CATEGORY_ALIASES[category]
  }
  const termPrefixed = category.match(/^.+ - (.+)$/)
  if (termPrefixed?.[1]) {
    return termPrefixed[1]
  }
  return category
}

function sanitizeTransactions(transactions: PaymentTransaction[]) {
  return transactions.map((tx) => ({
    ...tx,
    termLabel: TERM_ALIASES[tx.termLabel] ?? tx.termLabel,
    breakdown: tx.breakdown.map((item) => ({
      ...item,
      category: sanitizeCategory(item.category),
    })),
  }))
}

export async function seedApp() {
  if (hasSeeded) {
    return
  }

  const seed = generateSeedData()
  const snapshot = useAppStore.getState()

  if (Object.keys(snapshot.children).length === 0) {
    useAppStore.setState({
      children: seed.children,
      timetable: seed.timetable,
      results: seed.results,
      badges: seed.badges,
      fees: seed.fees,
      transactions: seed.feeTransactions,
      learnSession: seed.learnSession,
    })
  } else if (!snapshot.fees) {
    useAppStore.setState({ fees: seed.fees, transactions: seed.feeTransactions })
  } else {
    const nextFees = {
      ...snapshot.fees,
      upcoming: snapshot.fees.upcoming ?? seed.fees.upcoming,
      termBreakdown: snapshot.fees.termBreakdown ?? seed.fees.termBreakdown,
    }
    const nextTransactions = sanitizeTransactions(snapshot.transactions)

    useAppStore.setState({
      fees: nextFees,
      transactions: nextTransactions,
    })
  }

  await Promise.all([
    ...Object.entries(seed.attendance).map(([childId, entries]) =>
      attendanceService.seed(childId, entries),
    ),
    ...Object.entries(seed.exams).map(([childId, entries]) =>
      examsService.seed(childId, entries),
    ),
  ])

  hasSeeded = true
}

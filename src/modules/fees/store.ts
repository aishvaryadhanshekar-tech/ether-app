import type { StateCreator } from "zustand"
import type { AppStore } from "@/store/rootStore"
import {
  createDefaultChildProfiles,
  createDefaultRolloverFamily,
} from "@/modules/fees/rollover/constants"
import type {
  AdultProfile,
  AdultRole,
  ChildRolloverProfile,
  RolloverFamily,
  RolloverProgressSnapshot,
} from "@/modules/fees/rollover/types"
import type {
  FeePaymentTarget,
  FeeSummary,
  PaymentMethod,
  PaymentTransaction,
} from "@/modules/fees/types"
import { addDaysToIsoDate } from "@/modules/fees/utils"

export interface FeesSlice {
  fees: FeeSummary | null
  transactions: PaymentTransaction[]
  rolloverCompletedChildIds: string[]
  rolloverDraftChildIds: string[]
  rolloverFamily: RolloverFamily
  rolloverChildProfiles: Record<string, ChildRolloverProfile>
  agreedDocIdsByChild: Record<string, string[]>
  esignNameByChild: Record<string, string>
  updateRolloverAdult: (role: AdultRole, patch: Partial<AdultProfile>) => void
  updateRolloverChildProfile: (childId: string, patch: Partial<ChildRolloverProfile>) => void
  agreeRolloverDeclaration: (childId: string, docId: string) => void
  setRolloverEsignName: (childId: string, name: string) => void
  saveRolloverDraft: (childId: string) => void
  restoreRolloverProgress: (childId: string, snapshot: RolloverProgressSnapshot) => void
  completeRollover: (childId: string) => void
  installmentStartedKeys: string[]
  installmentDueDateByChild: Record<string, string>
  recordFeePayment: (
    selectedChildIds: string[],
    amountPaise: number,
    method?: PaymentMethod,
    target?: FeePaymentTarget,
    isInstallment?: boolean,
  ) => PaymentTransaction[]
}

export const createFeesSlice: StateCreator<AppStore, [], [], FeesSlice> = (set, get) => ({
  fees: null,
  transactions: [],
  rolloverCompletedChildIds: [],
  rolloverDraftChildIds: [],
  installmentStartedKeys: [],
  installmentDueDateByChild: {},
  rolloverFamily: createDefaultRolloverFamily(),
  rolloverChildProfiles: createDefaultChildProfiles(),
  agreedDocIdsByChild: {},
  esignNameByChild: {},
  updateRolloverAdult: (role, patch) => {
    set((state) => ({
      rolloverFamily: {
        ...state.rolloverFamily,
        [role]: { ...state.rolloverFamily[role], ...patch },
      },
    }))
  },
  updateRolloverChildProfile: (childId, patch) => {
    set((state) => ({
      rolloverChildProfiles: {
        ...state.rolloverChildProfiles,
        [childId]: {
          ...(state.rolloverChildProfiles[childId] ?? createDefaultChildProfiles()[childId]),
          ...patch,
        },
      },
    }))
  },
  agreeRolloverDeclaration: (childId, docId) => {
    set((state) => {
      const current = state.agreedDocIdsByChild[childId] ?? []
      if (current.includes(docId)) {
        return {}
      }
      return {
        agreedDocIdsByChild: {
          ...state.agreedDocIdsByChild,
          [childId]: [...current, docId],
        },
      }
    })
  },
  setRolloverEsignName: (childId, name) => {
    set((state) => ({
      esignNameByChild: {
        ...state.esignNameByChild,
        [childId]: name,
      },
    }))
  },
  saveRolloverDraft: (childId) => {
    set((state) => {
      if (state.rolloverDraftChildIds.includes(childId)) {
        return {}
      }
      return {
        rolloverDraftChildIds: [...state.rolloverDraftChildIds, childId],
      }
    })
  },
  restoreRolloverProgress: (childId, snapshot) => {
    set((state) => ({
      rolloverFamily: snapshot.family,
      rolloverChildProfiles: snapshot.childProfile
        ? {
            ...state.rolloverChildProfiles,
            [childId]: snapshot.childProfile,
          }
        : state.rolloverChildProfiles,
      agreedDocIdsByChild: {
        ...state.agreedDocIdsByChild,
        [childId]: snapshot.agreedDocIds,
      },
      esignNameByChild: {
        ...state.esignNameByChild,
        [childId]: snapshot.esignName,
      },
    }))
  },
  completeRollover: (childId) => {
    set((state) => {
      const nextDrafts = state.rolloverDraftChildIds.filter((id) => id !== childId)
      if (state.rolloverCompletedChildIds.includes(childId)) {
        return { activeChildId: childId, rolloverDraftChildIds: nextDrafts }
      }
      return {
        activeChildId: childId,
        rolloverCompletedChildIds: [...state.rolloverCompletedChildIds, childId],
        rolloverDraftChildIds: nextDrafts,
      }
    })
  },
  recordFeePayment: (
    selectedChildIds,
    amountPaise,
    method = "upi",
    _target = "current",
    isInstallment = false,
  ) => {
    void _target
    const fees = get().fees
    const children = get().children
    if (!fees || amountPaise <= 0) {
      return []
    }

    const balances = { ...fees.childBalancesPaise }
    const termLabel = fees.termLabel
    const newTransactions: PaymentTransaction[] = []
    const nextInstallmentKeys = [...get().installmentStartedKeys]
    const nextInstallmentDueDates = { ...get().installmentDueDateByChild }
    const currentPlanTarget = "current"

    const normalizedChildIds = Array.from(
      new Set(selectedChildIds.filter((childId) => (balances[childId] ?? 0) > 0)),
    )

    if (normalizedChildIds.length === 0) {
      return []
    }

    let remainingToAllocate = amountPaise
    const outstandingSource = { ...fees.outstandingBreakdown }

    normalizedChildIds.forEach((childId) => {
      const childName = children[childId]?.name ?? "Student"
      const balance = balances[childId] ?? 0
      const paidForChild = Math.min(remainingToAllocate, balance)
      remainingToAllocate -= paidForChild
      if (paidForChild <= 0) {
        return
      }

      balances[childId] = balance - paidForChild
      const planKey = `${childId}:${currentPlanTarget}`
      if (isInstallment && !nextInstallmentKeys.includes(planKey)) {
        nextInstallmentKeys.push(planKey)
        nextInstallmentDueDates[childId] = addDaysToIsoDate(fees.dueDate, 60)
      }
      if (balances[childId] === 0) {
        const index = nextInstallmentKeys.indexOf(planKey)
        if (index >= 0) {
          nextInstallmentKeys.splice(index, 1)
        }
        delete nextInstallmentDueDates[childId]
      }

      const sourceBreakdown = outstandingSource[childId] ?? []
      const paidRatio = paidForChild / balance
      const breakdown =
        sourceBreakdown.length > 0
          ? sourceBreakdown
              .map((item, index) => {
                const share =
                  index === sourceBreakdown.length - 1
                    ? paidForChild -
                      sourceBreakdown
                        .slice(0, -1)
                        .reduce((sum, line) => sum + Math.round(line.amountPaise * paidRatio), 0)
                    : Math.round(item.amountPaise * paidRatio)
                return { category: item.category, amountPaise: share }
              })
              .filter((item) => item.amountPaise > 0)
          : [
              { category: "Tuition Fee", amountPaise: Math.round(paidForChild * 0.85) },
              { category: "Activity Fee", amountPaise: paidForChild - Math.round(paidForChild * 0.85) },
            ]

      outstandingSource[childId] =
        balances[childId] === 0
          ? []
          : sourceBreakdown
              .map((item, index) => {
                const paidShare =
                  index === sourceBreakdown.length - 1
                    ? paidForChild -
                      sourceBreakdown
                        .slice(0, -1)
                        .reduce((sum, line) => sum + Math.round(line.amountPaise * paidRatio), 0)
                    : Math.round(item.amountPaise * paidRatio)
                return { category: item.category, amountPaise: item.amountPaise - paidShare }
              })
              .filter((item) => item.amountPaise > 0)

      const randomSuffix = Math.floor(1000 + Math.random() * 9000)
      newTransactions.push({
        id: `tx_${Date.now()}_${randomSuffix}_${childId}`,
        receiptNumber: `REC-2026-${randomSuffix}`,
        childId,
        childName,
        termLabel,
        amountPaise: paidForChild,
        date: new Date().toISOString(),
        paymentMethod: method,
        paymentMethodDetails:
          method === "upi"
            ? "UPI (aarav@upi)"
            : method === "card"
              ? "HDFC Credit Card ****8921"
              : "Net Banking (ICICI)",
        paidBy: "Rajesh Mehta (Parent)",
        status: "successful",
        breakdown,
      })
    })

    if (newTransactions.length === 0) {
      return []
    }

    set((state) => ({
      fees: { ...fees, childBalancesPaise: balances, outstandingBreakdown: outstandingSource },
      transactions: [...newTransactions, ...state.transactions],
      installmentStartedKeys: nextInstallmentKeys,
      installmentDueDateByChild: nextInstallmentDueDates,
    }))
    return newTransactions
  },
})

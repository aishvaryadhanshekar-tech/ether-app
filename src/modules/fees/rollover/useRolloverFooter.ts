import { type ReactNode, useLayoutEffect } from "react"
import { useOutletContext } from "react-router-dom"

export interface RolloverSectionGuard {
  isDirty: boolean
  save: () => void
  discard: () => void
}

export interface RolloverOutletContext {
  setFooter: (node: ReactNode) => void
  requestLeave: () => void
  requestNestedBack: () => void
  readOnly: boolean
  setSectionGuard: (guard: RolloverSectionGuard | null) => void
}

export function useRolloverOutlet() {
  return useOutletContext<RolloverOutletContext>()
}

export function useRolloverFooter(footer: ReactNode, deps: unknown[]) {
  const { setFooter } = useRolloverOutlet()

  useLayoutEffect(() => {
    setFooter(footer)
    return () => setFooter(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- callers pass explicit deps
  }, deps)
}

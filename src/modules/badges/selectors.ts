import { useMemo } from "react"
import dayjs from "dayjs"
import { useAppStore } from "@/store/rootStore"
import type { Badge } from "@/modules/badges/types"

const EMPTY_BADGES: Badge[] = []

export function useBadges(childId: string) {
  const badges = useAppStore((state) => state.badges[childId] ?? EMPTY_BADGES)

  return useMemo(
    () => [...badges].sort((a, b) => dayjs(b.awardedAt).valueOf() - dayjs(a.awardedAt).valueOf()),
    [badges],
  )
}

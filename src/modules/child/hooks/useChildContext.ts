import { useActiveChild } from "@/shared/hooks/useActiveChild"

export function useChildContext() {
  return useActiveChild()
}

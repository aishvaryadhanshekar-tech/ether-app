import { useAppStore } from "@/store/rootStore"

export function useActiveChild() {
  const activeChildId = useAppStore((state) => state.activeChildId)
  const setActiveChild = useAppStore((state) => state.setActiveChild)
  return { activeChildId, setActiveChild }
}

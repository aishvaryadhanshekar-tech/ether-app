import { simulateDelay } from "@/services/delay"
import { useAppStore } from "@/store/rootStore"

export const badgesService = {
  async getByChild(childId: string) {
    await simulateDelay()
    return useAppStore.getState().badges[childId] ?? []
  },
}

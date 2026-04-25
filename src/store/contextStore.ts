import type { StateCreator } from "zustand"
import type { AppStore } from "@/store/rootStore"

export interface ContextSlice {
  activeChildId: string
  setActiveChild: (id: string) => void
}

export const createContextSlice: StateCreator<AppStore, [], [], ContextSlice> = (
  set,
) => ({
  activeChildId: "child_1",
  setActiveChild: (id) => set({ activeChildId: id }),
})

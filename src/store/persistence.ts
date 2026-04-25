import { createJSONStorage } from "zustand/middleware"
import type { PersistOptions } from "zustand/middleware"
import type { AppStore } from "@/store/rootStore"

export const persistOptions: PersistOptions<AppStore> = {
  name: "ether-db",
  version: 1,
  storage: createJSONStorage(() => localStorage),
}

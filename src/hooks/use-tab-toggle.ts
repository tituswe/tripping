import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface useTabToggleStore {
	tab: string;
	setTab: (tab: string) => void;
}

export const useTabToggle = create(
	persist<useTabToggleStore>(
		(set, get) => ({
			tab: "gallery",
			setTab: (tab: string) => {
				set({ tab });
			}
		}),
		{
			name: "tab",
			storage: createJSONStorage(() => localStorage)
		}
	)
);

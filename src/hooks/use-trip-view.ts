import { ViewType } from "@/app/(features)/trips/[id]/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface useTripViewStore {
	view: ViewType | null;
	setView: (mode: ViewType) => void;
}

export const useTripView = create(
	persist<useTripViewStore>(
		(set) => ({
			view: null,
			setView: (v) => {
				set({ view: v });
			}
		}),
		{
			name: "tripView",
			storage: createJSONStorage(() => localStorage)
		}
	)
);

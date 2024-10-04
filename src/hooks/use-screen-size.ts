import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ScreenSize = "sm" | "md" | "lg" | "xl";

interface useScreenSizeStore {
	screenSize: ScreenSize;
	setScreenSize: (size: ScreenSize) => void;
}

export const useScreenSize = create(
	persist<useScreenSizeStore>(
		(set, get) => ({
			screenSize: "md",
			setScreenSize: (size) => set({ screenSize: size })
		}),
		{
			name: "screenSize",
			storage: createJSONStorage(() => localStorage)
		}
	)
);

export const useScreenResize = () => {
	const setScreenSize = useScreenSize((state) => state.setScreenSize);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			if (width < 768) {
				setScreenSize("sm");
			} else if (width < 1024) {
				setScreenSize("md");
			} else if (width < 1280) {
				setScreenSize("lg");
			} else {
				setScreenSize("xl");
			}
		};

		window.addEventListener("resize", handleResize);
		handleResize(); // Call initially to set the correct size

		return () => window.removeEventListener("resize", handleResize);
	}, [setScreenSize]);
};

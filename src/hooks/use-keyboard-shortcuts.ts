import { TripItem } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect } from "react";

export const useKeyboardShortcuts = (
	actionableTripItem: TripItem | null,
	handleDelete: () => void,
	setTab: Dispatch<SetStateAction<string>>
) => {
	useEffect(() => {
		if (!actionableTripItem) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Backspace") {
				handleDelete();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [actionableTripItem]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "1" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setTab("gallery");
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "2" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setTab("table");
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "3" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setTab("map");
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);
};

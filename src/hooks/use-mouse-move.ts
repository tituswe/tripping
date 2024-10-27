import { useEffect, useState } from "react";

export const useMouseMove = (timeoutDuration: number = 200) => {
	const [isMouseMoving, setIsMouseMoving] = useState(false);
	const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const handleMouseMove = () => {
			if (!isMouseMoving) {
				setIsMouseMoving(true);
			}

			if (timer) {
				clearTimeout(timer);
			}

			const newTimer = setTimeout(() => {
				setIsMouseMoving(false);
			}, timeoutDuration);

			setTimer(newTimer);
		};

		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			if (timer) {
				clearTimeout(timer);
			}
		};
	}, [isMouseMoving, timer, timeoutDuration]);

	return isMouseMoving;
};

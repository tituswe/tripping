import { useEffect, useState } from "react";

export const useIsMobile = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const userAgent = typeof window === "undefined" ? "" : navigator.userAgent;
		setIsMobile(/Mobi|Android/i.test(userAgent));
	}, []);

	return isMobile;
};

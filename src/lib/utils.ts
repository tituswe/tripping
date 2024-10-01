import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const currencyFormatter = Intl.NumberFormat("en-SG", {
	currency: "SGD",
	currencyDisplay: "symbol",
	currencySign: "standard",
	style: "currency",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});

export const controlSymbol = () => {
	const userAgent = navigator.userAgent.toLowerCase();
	if (userAgent.includes("win")) {
		return "Ctrl";
	} else if (userAgent.includes("mac")) {
		return "⌘";
	} else {
		return ""; // Default case if OS is neither Windows nor macOS
	}
};

export const placeType = (types?: string[]): string | null => {
	if (types?.includes("locality")) return "District";
	if (types?.includes("administrative_area_level_1")) return "City";
	if (types?.includes("country")) return "Country";
	return null;
};

export const shortNumber = (num: number): string => {
	if (num >= 1000) {
		return `${Math.floor(num / 1000)}K`;
	}
	return num.toString();
};

export const snakeToNormalCase = (snakeCaseStr: string): string => {
	return snakeCaseStr
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

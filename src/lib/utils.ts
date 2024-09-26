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

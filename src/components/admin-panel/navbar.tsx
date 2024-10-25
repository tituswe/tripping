"use client";

import { TripModel } from "@/lib/types";
import { usePathname } from "next/navigation";

const blockedRoutesRegex = /^\/trips\/(?!new).*$/;

interface NavbarProps {
	trips: TripModel[];
}

export function Navbar({ trips }: NavbarProps) {
	const pathname = usePathname();

	const isBlockedRoute = blockedRoutesRegex.test(pathname);

	if (isBlockedRoute) {
		return null;
	}

	return (
		<nav className="fixed top-0 left-0 z-40 right-0 h-[72px] sm:hidden flex bg-background border-b">
			<div className="w-[72px] mr-4 h-full" />
			{/* Add your navbar content here */}
			<div className="w-full flex justify-center items-center">
				Navbar content
			</div>
		</nav>
	);
}

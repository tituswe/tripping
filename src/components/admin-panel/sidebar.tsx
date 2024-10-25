"use client";

import { TripModel } from "@/lib/types";
import { Menu } from "./menu";

interface SidebarProps {
	trips: TripModel[];
}

export function Sidebar({ trips }: SidebarProps) {
	return (
		<aside className="fixed top-0 left-0 z-50 h-screen -translate-x-full sm:translate-x-0 transition-[width] ease-in-out duration-300 w-[72px] bg-background">
			<div className="relative h-full flex flex-col px-1 pt-4 pb-0 overflow-y-hidden shadow-md dark:shadow-zinc-800">
				<div className="h-16" />
				<Menu trips={trips} />
			</div>
		</aside>
	);
}

"use client";

import { UserNav } from "@/components/admin-panel/user-nav";
import { ModeToggle } from "@/components/custom-ui/mode-toggle";

interface TripConfigOptionsProps {}

export function TripConfigOptions({}: TripConfigOptionsProps) {
	return (
		<div className="absolute top-5 right-5 flex space-x-0">
			<ModeToggle />
			<UserNav />
		</div>
	);
}

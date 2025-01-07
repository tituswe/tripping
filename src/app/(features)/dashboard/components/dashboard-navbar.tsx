"use client";

import { UserNav } from "@/components/admin-panel/user-nav";
import { ModeToggle } from "@/components/custom-ui/mode-toggle";
import { Send } from "lucide-react";
import Link from "next/link";

export function DashboardNavbar() {
	return (
		<div className="flex justify-between items-center h-20 w-full max-w-screen-xl px-6">
			<Link
				href="/"
				className="relative z-20 flex items-center text-lg font-medium"
			>
				<Send className="h-6 w-6 mr-2" />
				trippin
			</Link>

			<div className="flex justify-center items-center w-32 space-x-1.5">
				<ModeToggle />
				<UserNav />
			</div>
		</div>
	);
}

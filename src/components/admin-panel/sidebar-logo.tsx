"use client";

import { Send } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SidebarLogo() {
	return (
		<Button
			className="transition-transform ease-in-out duration-300 mb-1 translate-x-1"
			variant="link"
			asChild
		>
			<Link href="/dashboard" className="flex items-center gap-2">
				<Send className="w-6 h-6 mr-1 flex-shrink-0" />
			</Link>
		</Button>
	);
}

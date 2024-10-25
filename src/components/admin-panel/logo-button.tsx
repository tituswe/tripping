"use client";

import { Send } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function LogoButton() {
	return (
		<Button
			className="fixed top-4 left-4 z-50 transition-transform ease-in-out duration-300 mb-1 bg-background"
			variant="link"
			size="lgIcon"
			asChild
		>
			<Link href="/dashboard" className="flex items-center gap-2">
				<Send className="w-6 h-6 mr-1 flex-shrink-0" />
			</Link>
		</Button>
	);
}

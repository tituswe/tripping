import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarToggleProps {
	isOpen?: boolean;
	setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
	return (
		<Button
			onClick={() => setIsOpen?.()}
			className={`rounded-md w-8 h-8 mt-auto ml-2 mb-5 ${
				isOpen && "translate-x-56"
			}`}
			variant="outline"
			size="icon"
		>
			<ChevronLeft
				className={cn(
					"h-4 w-4 transition-transform ease-in-out duration-700",
					isOpen === false ? "rotate-180" : "rotate-0"
				)}
			/>
		</Button>
	);
}

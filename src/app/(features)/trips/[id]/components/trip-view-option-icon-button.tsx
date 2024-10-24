"use client";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";

interface TripViewOptionIconButtonProps {
	tooltip: string;
	icon: LucideIcon;
	callBack?: () => void;
}

export function TripViewOptionIconButton({
	icon: Icon,
	tooltip,
	callBack
}: TripViewOptionIconButtonProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button size="icon" variant="outline" onClick={callBack}>
						<Icon className="w-4 h-4 text-secondary-foreground" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>{tooltip}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

"use client";

import { usePathname } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/components/ui/tooltip";
import { getMenuList } from "@/lib/menu-list";
import { TripModel } from "@/lib/types";
import Link from "next/link";
import { GooglePhoto } from "./google-photo";

interface MenuProps {
	trips: TripModel[];
}

export function Menu({ trips }: MenuProps) {
	const pathname = usePathname();
	const { menuOptions, tripOptions } = getMenuList(pathname, trips);

	return (
		<nav className="my-4 h-full w-full">
			<ul className="flex flex-col items-center h-full text-secondary-foreground">
				{menuOptions.map(({ icon: Icon, ...item }) => (
					<li
						key={item.href}
						className="w-16 h-16 transition rounded-md hover:bg-muted cursor-pointer"
					>
						<Link
							href={item.href}
							className="w-full h-full flex flex-col items-center justify-center space-y-1 rounded-md"
						>
							<Icon size={18} />
							<p className="text-xs">{item.label}</p>
						</Link>
					</li>
				))}
				<Separator className="mt-3 mb-5" />
				<ScrollArea className="mb-20">
					{tripOptions.map((item) => (
						<Link key={item.href} href={item.href}>
							<TooltipProvider disableHoverableContent>
								<Tooltip delayDuration={100}>
									<TooltipTrigger asChild>
										<li className="w-16 h-16 mt-3 flex flex-col items-center justify-center space-y-1 cursor-pointer group transition">
											<GooglePhoto
												placeId={item.locationId}
												className="w-[40px] height-[40px] aspect-square rounded-md"
											/>
											<p className="text-xs text-center w-full truncate px-1">
												{item.label}
											</p>
										</li>
									</TooltipTrigger>
									<TooltipContent side="top">{item.tooltip}</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</Link>
					))}
				</ScrollArea>
			</ul>
		</nav>
	);
}

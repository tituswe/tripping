"use client";

import { usePathname } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getMenuList } from "@/lib/menu-list";
import { TripModel } from "@/lib/types";
import Link from "next/link";
import { MenuTripPhoto } from "./menu-trip-photo";

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
				<Separator className="mt-3 mb-6" />
				<ScrollArea className="mb-20">
					{tripOptions.map((item) => (
						<Link key={item.href} href={item.href}>
							<li className="w-16 h-16 flex flex-col items-center justify-center space-y-1 cursor-pointer group transition">
								<MenuTripPhoto placeId={item.locationId} />
								<p className="text-xs text-center w-full truncate px-1">
									{item.label}
								</p>
							</li>
						</Link>
					))}
				</ScrollArea>
			</ul>
		</nav>
	);
}

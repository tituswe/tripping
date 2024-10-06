import {
	BugPlay,
	CirclePlus,
	LayoutGrid,
	LucideIcon,
	MapPin
} from "lucide-react";
import { TripModel } from "./types";

type Submenu = {
	href: string;
	label: string;
	active: boolean;
};

type Menu = {
	href: string;
	label: string;
	active: boolean;
	icon: LucideIcon;
	submenus: Submenu[];
};

type Group = {
	groupLabel: string;
	menus: Menu[];
};

export function getMenuList(pathname: string, trips: TripModel[]): Group[] {
	return [
		{
			groupLabel: "",
			menus: [
				{
					href: "/dashboard",
					label: "Dashboard",
					active: pathname.includes("/dashboard"),
					icon: LayoutGrid,
					submenus: []
				}
			]
		},
		{
			groupLabel: "Trips",
			menus: [
				...trips.map((trip) => ({
					href: `/trips/${trip.id}`,
					label: trip.location.formattedAddress || "",
					active: pathname.includes(`/${trip.id}`),
					icon: MapPin,
					submenus: []
				})),
				{
					href: "/trips/new",
					label: "New Trip",
					active: pathname === "/trips/new",
					icon: CirclePlus,
					submenus: []
				}
			]
		},
		{
			groupLabel: "",
			menus: [
				{
					href: "/playground",
					label: "Playground",
					active: pathname.includes("/playground"),
					icon: BugPlay,
					submenus: []
				}
			]
		}
	];
}

import { CirclePlus, LayoutGrid, LucideIcon } from "lucide-react";
import { TripModel } from "./types";

type MenuOption = {
	href: string;
	label: string;
	active: boolean;
	icon: LucideIcon;
};

type TripOption = {
	href: string;
	label: string;
	tooltip: string;
	active: boolean;
	locationId: string;
};

type MenuList = {
	menuOptions: MenuOption[];
	tripOptions: TripOption[];
};

export function getMenuList(pathname: string, trips: TripModel[]): MenuList {
	const menuOptions = [
		{
			href: "/dashboard",
			label: "Home",
			active: pathname.includes("/dashboard"),
			icon: LayoutGrid
		},
		{
			href: "/trips/new",
			label: "New",
			active: pathname === "/trips/new",
			icon: CirclePlus
		}
	];

	const tripOptions = trips.map((trip) => ({
		href: `/trips/${trip.id}`,
		label: trip.location.name || trip.location.formattedAddress || "",
		tooltip: trip.title || trip.location.formattedAddress || "",
		active: pathname.includes(`/${trip.id}`),
		locationId: trip.location.placeId
	}));

	return { menuOptions, tripOptions };
}

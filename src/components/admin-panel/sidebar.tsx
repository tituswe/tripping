import { getTrips } from "@/actions/actions";
import { TripModel } from "@/lib/types";
import { Menu } from "./menu";
import { SidebarLogo } from "./sidebar-logo";

export async function Sidebar() {
	const trips: TripModel[] = await getTrips();

	return (
		<aside className="fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300 w-[72px] bg-background">
			<div className="relative h-full flex flex-col px-1 pt-4 pb-0 overflow-y-hidden shadow-md dark:shadow-zinc-800">
				<SidebarLogo />
				<Menu trips={trips} />
			</div>
		</aside>
	);
}

import { getTrips } from "@/actions/actions";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { TripModel } from "@/lib/types";
import { LogoButton } from "./logo-button";

interface AdminPanelLayoutProps {
	children: React.ReactNode;
}

export default async function AdminPanelLayout({
	children
}: AdminPanelLayoutProps) {
	const trips: TripModel[] = await getTrips();

	return (
		<>
			<Sidebar trips={trips} />
			<LogoButton />
			<main className="min-h-[100vh] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300 sm:ml-[72px] sm:pt-0">
				{children}
			</main>
		</>
	);
}

"use-client";

import { TripModel } from "@/lib/types";
import { DashboardHistoryTripCard } from "./dashboard-history-trip-card";

interface DashboardExploreProps {
	trips: TripModel[];
}

export function DashboardExplore({ trips }: DashboardExploreProps) {
	return (
		<div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 5xl:grid-cols-9 6xl:grid-cols-10 gap-6">
				{trips.map((trip, index) => (
					<DashboardHistoryTripCard key={index} trip={trip} />
				))}
			</div>
			{trips.length === 0 && (
				<p className="text-sm font-light text-muted-foreground">
					We&apos;re working on curating trip plans for you...
				</p>
			)}
		</div>
	);
}

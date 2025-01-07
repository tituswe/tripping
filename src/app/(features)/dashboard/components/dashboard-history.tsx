"use client";

import { TripModel } from "@/lib/types";
import { DashboardTripCard } from "./dashboard-trip-card";

interface DashboardHistoryProps {
	trips: TripModel[];
}

export function DashboardHistory({ trips }: DashboardHistoryProps) {
	return (
		<div className="border-b pb-12">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{trips.map((trip, index) => (
					<DashboardTripCard key={index} trip={trip} />
				))}
			</div>
			{trips.length === 0 && (
				<p className="text-sm font-light text-muted-foreground">
					You haven&apos;t been on any trips yet.
				</p>
			)}
		</div>
	);
}

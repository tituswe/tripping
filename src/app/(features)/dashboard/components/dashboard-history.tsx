"use client";

import { Separator } from "@/components/ui/separator";
import { TripModel } from "@/lib/types";
import { DashboardTripCard } from "./dashboard-trip-card";

interface DashboardHistoryProps {
	trips: TripModel[];
}

export function DashboardHistory({ trips }: DashboardHistoryProps) {
	return (
		<div className="mb-12">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h2 className="text-2xl font-semibold tracking-tight">Past trips</h2>
					<p className="text-sm text-muted-foreground">
						Relive and share the old memories.
					</p>
				</div>
			</div>
			<Separator className="my-4" />
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 5xl:grid-cols-9 6xl:grid-cols-10 gap-6">
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

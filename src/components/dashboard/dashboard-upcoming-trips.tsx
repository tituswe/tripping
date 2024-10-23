"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TripModel } from "@/lib/types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { DashboardTripCard } from "./dashboard-trip-card";

interface DashboardUpcomingTripsProps {
	trips: TripModel[];
}

export function DashboardUpcomingTrips({ trips }: DashboardUpcomingTripsProps) {
	const router = useRouter();

	return (
		<div className="mb-12">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h2 className="text-2xl font-semibold tracking-tight">
						Your upcoming trips
					</h2>
					<p className="text-sm text-muted-foreground">
						Dive back into planning your next adventure.
					</p>
				</div>
				<Button onClick={() => router.push("/trips/new")}>
					<Plus className="w-4 h-4 mr-2" />
					<p>Plan a new trip</p>
				</Button>
			</div>
			<Separator className="my-4" />
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 5xl:grid-cols-9 6xl:grid-cols-10 gap-6">
				{trips.map((trip, index) => (
					<DashboardTripCard key={index} trip={trip} />
				))}
			</div>
			{trips.length === 0 && (
				<p className="text-sm font-light text-muted-foreground">
					Get started by planning your next trip!
				</p>
			)}
		</div>
	);
}

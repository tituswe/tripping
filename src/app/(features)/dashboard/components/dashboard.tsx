"use client";

import { TripModel } from "@/lib/types";

import { Separator } from "@/components/ui/separator";
import { DashboardExplore } from "./dashboard-explore";
import { DashboardHistory } from "./dashboard-history";
import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardTripFinder } from "./dashboard-trip-finder";

export interface DashboardProps {
	trips: TripModel[];
}

export function Dashboard({ trips }: DashboardProps) {
	const today = new Date();
	const upcomingTrips = trips.filter(
		(trip) => !trip.to || new Date(trip.to) > today
	);
	const pastTrips = trips.filter(
		(trip) => trip.to && new Date(trip.to) <= today
	);
	const exploreTrips = [] as TripModel[];

	return (
		<div className="flex flex-col items-center mb-36">
			<DashboardNavbar />
			<Separator />
			<div className="w-full max-w-screen-xl pt-12 space-y-6 px-6">
				<h1 className="text-3xl font-medium">Trips</h1>
				<DashboardTripFinder trips={upcomingTrips} />
			</div>
			<div className="w-full max-w-screen-xl pt-12 space-y-6 px-6">
				<h1 className="text-xl font-medium">Where you&apos;ve been</h1>
				<DashboardHistory trips={pastTrips} />
			</div>
			<div className="w-full max-w-screen-xl pt-12 space-y-6 px-6">
				<h1 className="text-4xl text-center font-medium">Explore the World!</h1>
				<DashboardExplore trips={exploreTrips} />
			</div>
		</div>
	);
}

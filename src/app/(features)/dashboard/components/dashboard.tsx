"use client";

import { TripModel } from "@/lib/types";

import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardTripFinder } from "./dashboard-trip-finder";

export interface DashboardProps {
	trips: TripModel[];
}

export function Dashboard({ trips }: DashboardProps) {
	const { data: session } = useSession();

	const today = new Date();
	const upcomingTrips = trips.filter(
		(trip) => !trip.to || new Date(trip.to) > today
	);
	const pastTrips = trips.filter(
		(trip) => trip.to && new Date(trip.to) <= today
	);
	const exploreTrips = [] as TripModel[];

	// return (
	// 	<div className="pt-[92px] sm:pt-6 h-full w-full flex flex-col justify-center p-6">
	// 		{session?.user && (
	// 			<>
	// 				<DashboardUpcomingTrips trips={upcomingTrips} />
	// 				<DashboardHistory trips={pastTrips} />
	// 			</>
	// 		)}
	// 		<DashboardExplore trips={exploreTrips} />
	// 	</div>
	// );

	return (
		<div className="flex flex-col items-center">
			<DashboardNavbar />
			<Separator />
			<div className="w-full max-w-screen-xl py-12 space-y-6 px-6">
				<h1 className="text-3xl font-medium">Trips</h1>
				<DashboardTripFinder trips={upcomingTrips} />
			</div>
		</div>
	);
}

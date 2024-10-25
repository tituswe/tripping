"use client";

import { TripModel } from "@/lib/types";

import { useSession } from "next-auth/react";
import { DashboardExplore } from "./dashboard-explore";
import { DashboardHistory } from "./dashboard-history";
import { DashboardUpcomingTrips } from "./dashboard-upcoming-trips";

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

	console.log(
		session?.user
			? `User is signed in\n${session.user.email}`
			: "No user signed in"
	);

	return (
		<div className="pt-[92px] sm:pt-6 h-full w-full flex flex-col justify-center p-6">
			{session?.user && (
				<>
					<DashboardUpcomingTrips trips={upcomingTrips} />
					<DashboardHistory trips={pastTrips} />
				</>
			)}
			<DashboardExplore trips={exploreTrips} />
		</div>
	);
}

"use client";

import { TripModel } from "@/lib/types";

import { APIProvider } from "@vis.gl/react-google-maps";

import { useTripsLocationPhotos } from "@/hooks/use-trips-location-photos";
import { DashboardExplore } from "./dashboard-explore";
import { DashboardHistory } from "./dashboard-history";
import { DashboardMap } from "./dashboard-map";
import { DashboardUpcomingTrips } from "./dashboard-upcoming-trips";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const libraries = ["places"];

export interface DashboardProps {
	trips: TripModel[];
}

function Dashboard({ trips: tripsWithoutPhotos }: DashboardProps) {
	const trips = useTripsLocationPhotos(tripsWithoutPhotos);

	const today = new Date();
	const upcomingTrips = trips.filter(
		(trip) => !trip.to || new Date(trip.to) > today
	);
	const pastTrips = trips.filter(
		(trip) => trip.to && new Date(trip.to) <= today
	);
	const exploreTrips = [] as TripModel[];

	return (
		<div className="h-full w-full flex flex-col justify-center p-6">
			<DashboardMap trips={trips} />
			<DashboardUpcomingTrips trips={upcomingTrips} />
			<DashboardHistory trips={pastTrips} />
			<DashboardExplore trips={exploreTrips} />
		</div>
	);
}

export function DashboardWithAPIProvider({ trips }: DashboardProps) {
	return (
		<APIProvider apiKey={API_KEY} libraries={libraries}>
			<Dashboard trips={trips} />
		</APIProvider>
	);
}

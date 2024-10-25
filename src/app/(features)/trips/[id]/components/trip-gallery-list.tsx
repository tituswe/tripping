"use client";

import { TripModel } from "@/lib/types";
import { TripGalleryCard } from "./trip-gallery-card";

interface TripGalleryListProps {
	trip: TripModel;
	selectedDay: number;
}

export function TripGalleryList({ trip, selectedDay }: TripGalleryListProps) {
	return (
		<div className="">
			<TripGalleryCard place={trip.places[0]} />
		</div>
	);
}

"use client";

import { useStore } from "@/hooks/use-store";
import { useTripView } from "@/hooks/use-trip-view";
import { PlaceModel, TripModel, UserModel } from "@/lib/types";
import { GoogleMapsProvider } from "@/providers/google-maps-provider";
import { useEffect, useState } from "react";
import { TripConfigOptions } from "./components/trip-config-options";
import { TripGallery } from "./components/trip-gallery";
import { TripKanban } from "./components/trip-kanban";
import { TripMap } from "./components/trip-map";
import { TripViewOptions } from "./components/trip-view-options";

interface TripClientProps {
	users: UserModel[];
	trip: TripModel;
}

export function TripClient({ users, trip }: TripClientProps) {
	const [hoveredPlace, setHoveredPlace] = useState<PlaceModel | null>(null);
	const [selectedPlace, setSelectedPlace] = useState<PlaceModel | null>(null);
	const [selectedDate, setSelectedDate] = useState<Date | null>(trip.from);
	const viewStore = useStore(useTripView, (state) => state);

	useEffect(() => {
		const placeIds = trip.places.map((place) => place.id);

		if (!selectedPlace?.id) return;

		if (!placeIds.includes(selectedPlace?.id)) {
			setSelectedPlace(null);
		}
	}, [trip, selectedPlace]);

	useEffect(() => {
		if (!trip || !trip.from || !trip.to) return;

		if (!selectedDate || trip.from > selectedDate || trip.to < selectedDate) {
			setSelectedDate(trip.from);
		}
	}, [trip, selectedDate]);

	if (!viewStore) return;

	const { view, setView } = viewStore;

	return (
		<GoogleMapsProvider>
			<div className="relative h-screen overflow-y-hidden">
				<TripMap
					view={view}
					trip={trip}
					hoveredPlace={hoveredPlace}
					setHoveredPlace={setHoveredPlace}
					selectedPlace={selectedPlace}
					setSelectedPlace={setSelectedPlace}
				/>
				<TripViewOptions view={view} setView={setView} />
				<TripGallery
					users={users}
					trip={trip}
					view={view}
					setView={setView}
					selectedPlace={selectedPlace}
					setSelectedPlace={setSelectedPlace}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
				/>
				<TripKanban
					users={users}
					trip={trip}
					view={view}
					setView={setView}
					selectedPlace={selectedPlace}
					setSelectedPlace={setSelectedPlace}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
				/>
				<TripConfigOptions />
			</div>
		</GoogleMapsProvider>
	);
}

"use client";

import { useStore } from "@/hooks/use-store";
import { useTripView } from "@/hooks/use-trip-view";
import { PlaceModel, TripModel, UserModel } from "@/lib/types";
import { GoogleMapsProvider } from "@/providers/google-maps-provider";
import { useState } from "react";
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
	const viewStore = useStore(useTripView, (state) => state);

	if (!viewStore) return;

	const { view, setView } = viewStore;

	return (
		<GoogleMapsProvider>
			<div className="relative h-screen">
				<TripMap
					trip={trip}
					hoveredPlace={hoveredPlace}
					setHoveredPlace={setHoveredPlace}
					selectedPlace={selectedPlace}
					setSelectedPlace={setSelectedPlace}
				/>
				<TripViewOptions view={view} setView={setView} />
				<TripGallery users={users} trip={trip} view={view} setView={setView} />
				<TripKanban users={users} trip={trip} view={view} setView={setView} />
				<TripConfigOptions />
			</div>
		</GoogleMapsProvider>
	);
}

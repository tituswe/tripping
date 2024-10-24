"use client";

import { PlaceModel, TripModel } from "@/lib/types";
import { GoogleMapsProvider } from "@/providers/google-maps-provider";
import { useState } from "react";
import { TripConfigOptions } from "./components/trip-config-options";
import { TripGallery } from "./components/trip-gallery";
import { TripKanban } from "./components/trip-kanban";
import { TripMap } from "./components/trip-map";
import { TripViewOptions } from "./components/trip-view-options";
import { ViewType } from "./types";

interface TripClientProps {
	trip: TripModel;
}

export function TripClient({ trip }: TripClientProps) {
	const [hoveredPlace, setHoveredPlace] = useState<PlaceModel | null>(null);
	const [selectedPlace, setSelectedPlace] = useState<PlaceModel | null>(null);
	const [view, setView] = useState<ViewType>(null);

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
				<TripGallery trip={trip} view={view} setView={setView} />
				<TripKanban trip={trip} view={view} setView={setView} />
				<TripConfigOptions />
			</div>
		</GoogleMapsProvider>
	);
}

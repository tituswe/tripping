"use client";

import { TripModel } from "@/lib/types";
import { Map } from "@vis.gl/react-google-maps";

interface DashboardMapProps {
	trips: TripModel[];
}

export function DashboardMap({ trips }: DashboardMapProps) {
	return (
		<Map
			mapId={"49ae42fed52588c3"}
			defaultZoom={12}
			defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
			gestureHandling={"greedy"}
			clickableIcons={false}
			disableDefaultUI
		/>
	);
}

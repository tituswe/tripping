"use client";

import { useGeolocation } from "@/hooks/use-geolocation";
import { GoogleMapsProvider } from "@/providers/google-maps-provider";
import { Map } from "@vis.gl/react-google-maps";
import { NewTrip } from "./components/new-trip";

export function Client() {
	const coordinates = useGeolocation();

	return (
		<GoogleMapsProvider>
			<div className="relative h-screen overflow-y-hidden">
				<NewTrip />
				<Map
					mapId={"49ae42fed52588c3"}
					defaultZoom={10}
					defaultCenter={coordinates}
					gestureHandling={"greedy"}
					clickableIcons={false}
					disableDefaultUI
				/>
			</div>
		</GoogleMapsProvider>
	);
}

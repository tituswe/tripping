"use client";

import { Map } from "@vis.gl/react-google-maps";

export function TripMap() {
	return (
		<div>
			<Map
				defaultZoom={3}
				defaultCenter={{ lat: 22.54992, lng: 0 }}
				gestureHandling={"greedy"}
				disableDefaultUI={true}
			/>
		</div>
	);
}

import { PlaceModel, TripModel } from "@/lib/types";
import { useCallback } from "react";

type MarkerData = Array<{
	id: string;
	position: google.maps.LatLngLiteral;
	zIndex: number;
	content: PlaceModel;
}>;

export const useMapMarkers = (trip: TripModel) => {
	const getMapMarkers = useCallback(() => {
		const markers: MarkerData = [];

		trip.places
			.sort((a, b) => (b.lat ?? 0) - (a.lat ?? 0))
			.forEach((place, index) => {
				if (!place.lat || !place.lng) return;

				markers.push({
					id: place.id,
					position: { lat: place.lat, lng: place.lng },
					zIndex: index,
					content: place
				});
			});

		const selectedZIdx = markers.length;
		const hoverZIdx = markers.length + 1;

		const totalPoints = markers.length;
		const center = totalPoints
			? {
					lat:
						markers.reduce((sum, marker) => sum + marker.position.lat, 0) /
						totalPoints,
					lng:
						markers.reduce((sum, marker) => sum + marker.position.lng, 0) /
						totalPoints
			  }
			: ({
					lat: trip.location.lat,
					lng: trip.location.lng
			  } as google.maps.LatLngLiteral);

		return { markers, selectedZIdx, hoverZIdx, center };
	}, [trip]);

	return getMapMarkers;
};

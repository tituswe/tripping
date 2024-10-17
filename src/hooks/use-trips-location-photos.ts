import { TripModel } from "@/lib/types";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export const useTripsLocationPhotos = (tripsWithoutPhotos: TripModel[]) => {
	const [trips, setTrips] = useState(tripsWithoutPhotos);

	const map = useMap();
	const places = useMapsLibrary("places");

	const [placesService, setPlacesService] =
		useState<google.maps.places.PlacesService | null>(null);

	useEffect(() => {
		if (!places || !map) return;

		setPlacesService(new places.PlacesService(map));
	}, [map, places]);

	useEffect(() => {
		if (!placesService) return;

		const fetchDetails = async () => {
			let tripsPhotos: string[][] = [];

			const promises = tripsWithoutPhotos.map((trip, index) => {
				return new Promise<void>((resolve) => {
					const detailRequestOptions = {
						placeId: trip.location.placeId,
						fields: ["photos"]
					};

					placesService.getDetails(detailRequestOptions, (placeDetails) => {
						const photos = placeDetails?.photos?.map((photo) => photo.getUrl());
						if (photos) {
							tripsPhotos[index] = photos;
						}
						resolve();
					});
				});
			});

			await Promise.all(promises);

			const updatedTrips = tripsWithoutPhotos.map(
				(trip, index) =>
					({
						...trip,
						location: {
							...trip.location,
							photos: tripsPhotos[index] || []
						}
					} as TripModel)
			);

			setTrips(updatedTrips);
		};

		fetchDetails();
	}, [placesService, tripsWithoutPhotos]);

	return trips;
};
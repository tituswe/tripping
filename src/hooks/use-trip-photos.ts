import { PlaceModel, TripModel } from "@/lib/types";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export const useTripPhotos = (tripWithoutPhotos: TripModel) => {
	const [trip, setTrip] = useState(tripWithoutPhotos);

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
			let locationPhotos: string[] = [];

			const detailRequestOptions = {
				placeId: tripWithoutPhotos.location.placeId,
				fields: ["photos"]
			};

			await new Promise<void>((resolve) => {
				placesService.getDetails(detailRequestOptions, (placeDetails) => {
					locationPhotos =
						placeDetails?.photos?.map((photo) => photo.getUrl()) || [];
					resolve();
				});
			});

			const updatedLocation = {
				...tripWithoutPhotos.location,
				photos: locationPhotos
			};

			let tripPhotos: string[][] = [];

			const promises = tripWithoutPhotos.places.map((place, index) => {
				return new Promise<void>((resolve) => {
					const detailRequestOptions = {
						placeId: place.placeId,
						fields: ["photos"]
					};

					placesService.getDetails(detailRequestOptions, (placeDetails) => {
						const photos = placeDetails?.photos?.map((photo) => photo.getUrl());
						if (photos) {
							tripPhotos[index] = photos;
						}
						resolve();
					});
				});
			});

			await Promise.all(promises);

			const updatedPlaces = tripWithoutPhotos.places.map(
				(place, index) =>
					({
						...place,
						photos: tripPhotos[index] || []
					} as PlaceModel)
			);

			setTrip({
				...tripWithoutPhotos,
				location: updatedLocation,
				places: updatedPlaces
			});
		};

		fetchDetails();
	}, [placesService, tripWithoutPhotos]);

	return trip;
};

import { PlaceModel, TripModel } from "@/lib/types";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

const photoCache = new Map<string, string[]>();

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

			const fetchPhotos = async (placeId: string) => {
				if (photoCache.has(placeId)) {
					return photoCache.get(placeId) || [];
				}

				const detailRequestOptions = {
					placeId,
					fields: ["photos"]
				};

				return new Promise<string[]>((resolve) => {
					placesService.getDetails(detailRequestOptions, (placeDetails) => {
						const photos =
							placeDetails?.photos?.map((photo) => photo.getUrl()) || [];
						photoCache.set(placeId, photos);
						resolve(photos);
					});
				});
			};

			locationPhotos = await fetchPhotos(tripWithoutPhotos.location.placeId);

			const updatedLocation = {
				...tripWithoutPhotos.location,
				photos: locationPhotos
			};

			let tripPhotos: string[][] = [];

			const promises = tripWithoutPhotos.places.map((place, index) => {
				return fetchPhotos(place.placeId).then((photos) => {
					tripPhotos[index] = photos;
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

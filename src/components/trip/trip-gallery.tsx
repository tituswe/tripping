"use client";

import { createPlace } from "@/actions/actions";
import { TripModel } from "@/lib/types";
import { PlaceReview } from "@prisma/client";
import { PlaceInput } from "../custom-ui/place-input";
import { TripGalleryCard } from "./trip-gallery-card";

interface TripGalleryProps {
	trip: TripModel;
}

export function TripGallery({ trip }: TripGalleryProps) {
	const places = trip.places;

	const onPlaceSelect = async (
		place: google.maps.places.PlaceResult | null
	) => {
		if (!place) return;

		if (!place.place_id) return;

		const country =
			place.address_components?.find((comp) => comp.types.includes("country"))
				?.long_name || null;
		const city =
			place.address_components?.find((comp) =>
				comp.types.includes("administrative_area_level_1")
			)?.long_name || null;
		const district =
			place.address_components?.find((comp) => comp.types.includes("locality"))
				?.long_name || null;

		const photos = place.photos?.map((photo) => photo.getUrl()) || [];

		const reviews =
			place.reviews?.map(
				(review) =>
					({
						authorName: review.author_name,
						authorUrl: review.author_url,
						language: review.language,
						profilePhotoUrl: review.profile_photo_url,
						rating: review.rating,
						relativeTimeDescription: review.relative_time_description,
						text: review.text,
						postedAt: new Date(review.time)
					} as PlaceReview)
			) || [];

		const newPlace = {
			placeId: place.place_id,
			tripId: trip.id,
			name: place.name || null,
			formattedAddress: place.formatted_address || null,
			country,
			city,
			district,
			lat: place.geometry?.location?.lat() || null,
			lng: place.geometry?.location?.lng() || null,
			tags: place.types || [],
			photos,
			openingHours: place.opening_hours?.weekday_text || [],
			rating: place.rating || null,
			userRatingsTotal: place.user_ratings_total || null,
			reviews
		};

		await createPlace(trip.id, newPlace);
	};

	return (
		<div>
			<div className="mx-7">
				<PlaceInput existingPlaces={places} onPlaceSelect={onPlaceSelect} />
			</div>
			<div className="flex flex-col gap-3 py-3">
				{places.map((place, index) => (
					<TripGalleryCard key={index} place={place} />
				))}
			</div>
		</div>
	);
}

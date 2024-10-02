"use client";

import {
	closestCenter,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { createPlace, updatePlace } from "@/actions/actions";
import { PlaceInput } from "@/components/custom-ui/place-input";
import { PlaceModel, TripModel } from "@/lib/types";
import { PlaceReview } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { TripGalleryCard } from "./trip-gallery-card";

interface TripGalleryProps {
	trip: TripModel;
}

export function TripGallery({ trip }: TripGalleryProps) {
	const [places, setPlaces] = useState<PlaceModel[]>([...trip.places]);

	// Synchronize places state with trip.places prop
	useEffect(() => {
		setPlaces([...trip.places]);
	}, [trip.places]);

	const placeIds = useMemo(() => places.map((place) => place.id), [places]);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	);

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
		<>
			<div className="mx-7">
				<PlaceInput existingPlaces={places} onPlaceSelect={onPlaceSelect} />
			</div>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<div className="space-y-3 py-3">
					<SortableContext
						items={placeIds}
						strategy={verticalListSortingStrategy}
					>
						{places.map((place) => (
							<TripGalleryCard key={place.id} place={place} />
						))}
					</SortableContext>
				</div>
			</DndContext>
		</>
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (active.id !== over?.id) {
			setPlaces((places) => {
				const oldIndex = places.findIndex((p) => p.id === active.id);
				const newIndex = places.findIndex((p) => p.id === over?.id);

				const newPlaces = arrayMove(places, oldIndex, newIndex);

				// To update the server with new sort order,
				// there has to be a more efficient way to do this
				newPlaces.forEach(async (np, index) => {
					const newOrder = newPlaces.length - index;
					await updatePlace(np.id, { sortOrder: newOrder });
				});

				return newPlaces;
			});
		}
	}
}

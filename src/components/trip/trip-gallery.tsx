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
import { DndCard } from "./types";
import { getCards } from "./utils";

interface TripGalleryProps {
	trip: TripModel;
	hoverId: string | null;
	setHoverId: (id: string | null) => void;
	selectedPlace: PlaceModel | null;
	setSelectedPlace: (place: PlaceModel | null) => void;
}

export function TripGallery({
	trip,
	hoverId,
	setHoverId,
	selectedPlace,
	setSelectedPlace
}: TripGalleryProps) {
	const initialCards = getCards(
		trip.places.sort((a, b) => b.sortOrder - a.sortOrder)
	);

	const [cards, setCards] = useState<DndCard[]>(initialCards);

	// Synchronize places state with trip.places prop
	useEffect(() => {
		setCards(getCards(trip.places, true));
	}, [trip.places]);

	const placeIds = useMemo(() => cards.map((place) => place.id), [cards]);

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
			date: null,
			dateSortOrder: null,
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
			<div className="mx-2">
				<PlaceInput
					existingPlaces={trip.places}
					onPlaceSelect={onPlaceSelect}
				/>
			</div>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<div className="h-[calc(100vh_-_240px)] space-y-3 mt-3 px-2 overflow-y-auto">
					{cards.length === 0 && (
						<p className="m-6 text-sm text-muted-foreground text-center">
							No places added yet.
						</p>
					)}
					{cards.length > 0 && (
						<SortableContext
							items={placeIds}
							strategy={verticalListSortingStrategy}
						>
							{cards.map((place) => (
								<TripGalleryCard
									key={place.id}
									trip={trip}
									card={place}
									isHoverCard={hoverId === place.id}
									setHoverId={setHoverId}
									isSelectedCard={selectedPlace?.id === place.id}
									setSelectedPlace={setSelectedPlace}
								/>
							))}
						</SortableContext>
					)}
				</div>
			</DndContext>
		</>
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (active.id !== over?.id) {
			setCards((cards) => {
				const oldIndex = cards.findIndex((c) => c.id === active.id);
				const newIndex = cards.findIndex((c) => c.id === over?.id);

				const newCards = arrayMove(cards, oldIndex, newIndex);

				// To update the server with new sort order,
				// there has to be a more efficient way to do this
				newCards.forEach(async (nc, index) => {
					const newOrder = newCards.length - index;
					await updatePlace(nc.content.id, { sortOrder: newOrder });
				});

				return newCards;
			});
		}
	}
}

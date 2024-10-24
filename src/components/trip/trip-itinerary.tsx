"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { createPlace, updatePlace } from "@/actions/actions";
import { useScreenSize } from "@/hooks/use-screen-size";
import { PlaceModel, TripModel } from "@/lib/types";
import {
	DndContext,
	type DragEndEvent,
	type DragOverEvent,
	DragOverlay,
	type DragStartEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	UniqueIdentifier,
	useSensor,
	useSensors
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { PlaceReview } from "@prisma/client";
import { CircleAlert } from "lucide-react";
import { TripItineraryCard } from "./trip-itinerary-card";
import {
	TripItineraryColumn,
	TripItineraryContainer
} from "./trip-itinierary-column";
import { DndCard } from "./types";
import {
	coordinateGetter,
	getCards,
	getDefaultCols,
	hasDraggableData
} from "./utils";

interface TripItineraryProps {
	trip: TripModel;
	hoverId: string | null;
	setHoverId: (id: string | null) => void;
	selectedPlace: PlaceModel | null;
	setSelectedPlace: (place: PlaceModel | null) => void;
}

export function TripItinerary({
	trip,
	hoverId,
	setHoverId,
	selectedPlace,
	setSelectedPlace
}: TripItineraryProps) {
	const [cards, setCards] = useState<DndCard[]>(
		getCards(trip.places, false, trip.from, trip.to)
	);

	const columns = getDefaultCols(trip.from, trip.to);

	const columnsId = columns.map((col) => col.id);

	const [activeCard, setActiveCard] = useState<DndCard | null>(null);

	const hoverCard = cards.find((c) => c.id === hoverId) || null;
	const selectedCard = cards.find((c) => c.id === selectedPlace?.id) || null;

	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: coordinateGetter
		})
	);

	const screen = useScreenSize();

	useEffect(() => {
		const galleryCards = cards.filter((c) => c.columnId === "");
		const columnsCopy = [...columns];

		const timeoutId = setTimeout(() => {
			galleryCards.forEach(async (nc, index) => {
				const newOrder = galleryCards.length - index;
				await updatePlace(nc.content.id, {
					date: new Date(nc.columnId),
					dateSortOrder: newOrder
				});
			});

			columnsCopy.forEach((col) => {
				const colCards = cards.filter((c) => c.columnId === col.id);
				colCards.forEach(async (nc, index) => {
					const newOrder = colCards.length - index;
					await updatePlace(nc.content.id, {
						date: new Date(nc.columnId),
						dateSortOrder: newOrder
					});
				});
			});
		}, 1000); // Delay timeout to prevent multiple updates

		return () => clearTimeout(timeoutId);
	}, [cards]);

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

	if (!trip.from || !trip.to) return <TripItineraryNull />;

	return (
		<>
			<DndContext
				sensors={sensors}
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
				onDragOver={onDragOver}
			>
				<SortableContext items={columnsId}>
					<div className="flex flex-col md:flex-row mt-3 h-[calc(100vh_-_188px)]">
						{screen.screenSize !== "sm" && (
							<TripItineraryColumn
								isSentinel
								column={{ id: "", title: "Gallery" }}
								cards={cards.filter((card) => card.columnId === "")}
								hoverCard={hoverCard}
								selectedCard={selectedCard}
								setHoverId={setHoverId}
								setSelectedPlace={setSelectedPlace}
							/>
						)}
						<TripItineraryContainer>
							{screen.screenSize === "sm" && (
								<TripItineraryColumn
									isSentinel
									column={{ id: "", title: "Gallery" }}
									cards={cards.filter((card) => card.columnId === "")}
									hoverCard={hoverCard}
									selectedCard={selectedCard}
									setHoverId={setHoverId}
									setSelectedPlace={setSelectedPlace}
								/>
							)}
							{columns.map((col) => (
								<TripItineraryColumn
									key={col.id}
									column={col}
									cards={cards.filter((card) => card.columnId === col.id)}
									hoverCard={hoverCard}
									selectedCard={selectedCard}
									setHoverId={setHoverId}
									setSelectedPlace={setSelectedPlace}
								/>
							))}
						</TripItineraryContainer>
					</div>
				</SortableContext>

				{"document" in window &&
					createPortal(
						<DragOverlay>
							{activeCard && (
								<TripItineraryCard
									card={activeCard}
									isOverlay
									setHoverId={setHoverId}
								/>
							)}
						</DragOverlay>,
						document.body
					)}
			</DndContext>
		</>
	);

	function onDragStart(event: DragStartEvent) {
		if (!hasDraggableData(event.active)) return;
		const data = event.active.data.current;

		if (data?.type === "Card") {
			setActiveCard(data.task);
			return;
		}
	}

	function onDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		if (activeId === overId) return;

		if (!hasDraggableData(active) || !hasDraggableData(over)) return;

		const activeData = active.data.current;
		const overData = over.data.current;

		const isActiveACard = activeData?.type === "Card";
		const isOverACard = overData?.type === "Card";

		if (!isActiveACard) return;

		if (isActiveACard && isOverACard) {
			console.log("DRAG END");
			setCards((cards) => {
				const activeIndex = cards.findIndex((c) => c.id === activeId);
				const overIndex = cards.findIndex((c) => c.id === overId);
				const activeCard = cards[activeIndex];
				const overCard = cards[overIndex];
				if (
					activeCard &&
					overCard &&
					activeCard.columnId !== overCard.columnId
				) {
					activeCard.columnId = overCard.columnId;
					return arrayMove(cards, activeIndex, overIndex - 1);
				}

				return arrayMove(cards, activeIndex, overIndex);
			});
		}
	}

	function onDragOver(event: DragOverEvent) {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		if (activeId === overId) return;

		if (!hasDraggableData(active) || !hasDraggableData(over)) return;

		const activeData = active.data.current;
		const overData = over.data.current;

		const isActiveACard = activeData?.type === "Card";

		if (!isActiveACard) return;

		const isOverAColumn = overData?.type === "Column";

		if (isActiveACard && isOverAColumn) {
			console.log("DRAG OVER");
			setCards((cards) => {
				const activeIndex = cards.findIndex((t) => t.id === activeId);
				const activeCard = cards[activeIndex];
				if (activeCard) {
					activeCard.columnId = overId as UniqueIdentifier;
					return arrayMove(cards, activeIndex, activeIndex);
				}

				return cards;
			});
		}
	}
}

function TripItineraryNull() {
	return (
		<div className="h-[calc(100vh_-_188px)]">
			<div className="p-3 rounded border text-sm text-muted-foreground flex items-center">
				<CircleAlert className="w-4 h-4 mr-2 text-destructive" />
				Add dates to your trip to use the Kanban Board
			</div>
		</div>
	);
}

"use client";

import { reorderPlaces } from "@/actions/actions";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { PlaceModel, TripModel } from "@/lib/types";
import {
	closestCenter,
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { eachDayOfInterval } from "date-fns";
import { useEffect, useState } from "react";
import { TripKanbanCard } from "./trip-kanban-card";
import { TripKanbanDay } from "./trip-kanban-day";

interface TripKanbanBoardProps {
	trip: TripModel;
	selectedPlace: PlaceModel | null;
	setSelectedPlace: (place: PlaceModel | null) => void;
	selectedDate: Date | null;
	setSelectedDate: (date: Date | null) => void;
}

export function TripKanbanBoard({
	trip,
	selectedPlace,
	setSelectedPlace,
	selectedDate,
	setSelectedDate
}: TripKanbanBoardProps) {
	const isMobile = useIsMobile();
	const [placesMap, setPlacesMap] = useState<Record<string, PlaceModel[]>>(
		getPlacesMap(trip)
	);

	useEffect(() => {
		setPlacesMap(getPlacesMap(trip));
	}, [trip]);

	const [activeId, setActiveId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	);

	return trip.from ? (
		!isMobile ? (
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			>
				<div className="flex flex-row flex-grow gap-1.5 mx-3 overflow-x-auto">
					{Object.entries(placesMap).map(([dateString, places]) => (
						<TripKanbanDay
							key={dateString}
							id={dateString}
							places={places}
							from={trip.from!}
							selectedDate={selectedDate}
							setSelectedDate={setSelectedDate}
							dateString={dateString}
						/>
					))}
					<DragOverlay>
						{activeId ? (
							<TripKanbanCard
								place={trip.places.find((place) => place.placeId === activeId)!}
								isOverlay
							/>
						) : null}
					</DragOverlay>
				</div>
			</DndContext>
		) : (
			<div className="flex flex-row flex-grow gap-1.5 mx-3 overflow-x-auto">
				{Object.entries(placesMap).map(([dateString, places]) => (
					<TripKanbanDay
						key={dateString}
						id={dateString}
						places={places}
						from={trip.from!}
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
						dateString={dateString}
					/>
				))}
			</div>
		)
	) : (
		<div className="h-full flex justify-center items-center">
			<p className="text-xs text-muted-foreground -translate-y-12">
				Add dates to start planning
			</p>
		</div>
	);

	function handleDragStart(event: DragStartEvent) {
		const data = event.active;

		setActiveId(data.id as string);

		const dragPlace = trip.places.find((place) => place.placeId === data.id);

		setSelectedPlace(dragPlace || null);
	}

	async function handleDragOver(event: DragOverEvent) {
		const { active, over } = event;

		if (!over) return;
		if (!over.data.current) {
			// This means that over is a container
			const activeDateString = active.data.current?.sortable.containerId;
			const overDateString = over.id as string;

			if (activeDateString === overDateString) return; // This means that active and over are in the same container

			if (placesMap[overDateString].length > 0) return; // This means that over container is not empty

			const activeDatePlaces = placesMap[activeDateString].filter(
				(place) => place.placeId !== active.id
			);
			const overDatePlaces = [
				...placesMap[overDateString],
				trip.places.find((place) => place.placeId === active.id)!
			];

			// BUG: When moving a card to an empty container above, there is a weird behavior where the scroll area keeps snapping to the above container. This causes a flickering effect which subsequently causes a max depth exceeded error. To fix this, we need to set the over container to the active container and the active container to the over container. This way, the scroll area will not snap to the above container.

			setPlacesMap({
				...placesMap,
				[activeDateString]: activeDatePlaces,
				[overDateString]: overDatePlaces
			});
		} else {
			// This means that over is a card
			if (active.id === over.id) return; // This means that active and over are the same card

			const activeDateString = active.data.current?.sortable.containerId;
			const overDateString = over.data.current?.sortable.containerId;

			if (activeDateString === overDateString) {
				// This means that active and over are in the same container
				const overDatePlaces = placesMap[overDateString];

				const activeIndex = overDatePlaces.findIndex(
					(place) => place.placeId === active.id
				);
				const overIndex = overDatePlaces.findIndex(
					(place) => place.placeId === over.id
				);

				const reorderedOverPlaces = arrayMove(
					overDatePlaces,
					activeIndex,
					overIndex
				);

				setPlacesMap({
					...placesMap,
					[overDateString]: reorderedOverPlaces
				});
			} else {
				const activeDatePlaces = placesMap[activeDateString].filter(
					(place) => place.placeId !== active.id
				);
				const overDatePlaces = [
					...placesMap[overDateString],
					trip.places.find((place) => place.placeId === active.id)!
				];

				const activeIndex = overDatePlaces.findIndex(
					(place) => place.placeId === active.id
				);
				const overIndex = overDatePlaces.findIndex(
					(place) => place.placeId === over.id
				);

				const reorderedOverPlaces = arrayMove(
					overDatePlaces,
					activeIndex,
					overIndex
				);

				setPlacesMap({
					...placesMap,
					[activeDateString]: activeDatePlaces,
					[overDateString]: reorderedOverPlaces
				});
			}
		}
	}

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (!over) return;

		const activeDateString = active.data.current?.sortable.containerId;

		let overDateString;
		if (!over.data.current) {
			// This means that over is a container
			overDateString = over.id as string;
		} else {
			// This means that over is a card
			overDateString = over.data.current?.sortable.containerId;
		}

		if (activeDateString !== overDateString) {
			await reorderPlaces(
				trip.id,
				new Date(overDateString),
				placesMap[activeDateString].map((place) => place.id)
			);
		}

		await reorderPlaces(
			trip.id,
			new Date(overDateString),
			placesMap[overDateString].map((place) => place.id)
		);

		setSelectedDate(new Date(overDateString));
	}

	function getPlacesMap(trip: TripModel): Record<string, PlaceModel[]> {
		if (!trip.from || !trip.to) return {};

		const dates = eachDayOfInterval({
			start: new Date(trip.from),
			end: new Date(trip.to)
		});

		const groups = trip.places
			.sort((a, b) => a.sortOrder - b.sortOrder)
			.reduce((acc, place) => {
				const dateString = place.date?.toDateString();
				if (dateString) {
					if (!acc[dateString]) {
						acc[dateString] = [];
					}
					acc[dateString].push(place);
				}
				return acc;
			}, {} as Record<string, PlaceModel[]>);

		return dates.reduce((acc, date) => {
			const dateString = date.toDateString();
			if (!acc[dateString]) {
				acc[dateString] = [];
			}
			acc[dateString] = groups[dateString] || [];
			return acc;
		}, {} as Record<string, PlaceModel[]>);
	}
}

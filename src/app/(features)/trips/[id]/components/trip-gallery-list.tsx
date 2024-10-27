"use client";

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
import { useState } from "react";

import { reorderPlaces } from "@/actions/actions";
import { Separator } from "@/components/ui/separator";
import { PlaceModel, TripModel } from "@/lib/types";
import { TripDayTabs } from "./trip-day-tabs";
import { TripGalleryCard } from "./trip-gallery-card";
import { TripGalleryDay } from "./trip-gallery-day";

interface TripGalleryListProps {
	trip: TripModel;
	selectedDate: Date | null;
	setSelectedDate: (day: Date | null) => void;
}

export function TripGalleryList({
	trip,
	selectedDate,
	setSelectedDate
}: TripGalleryListProps) {
	const groupedPlaces = getGroupedPlaces(trip);

	const [activeId, setActiveId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	);

	return (
		<>
			<div className="sticky top-0 z-20 pt-3 space-y-1.5 px-5 bg-background duration-700 ease-in-out">
				<TripDayTabs
					trip={trip}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
				/>
				<div className="h-1" />
				<Separator />
			</div>

			{trip.from && (
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragStart={handleDragStart}
					onDragOver={handleDragOver}
					onDragEnd={handleDragEnd}
				>
					{groupedPlaces.map(([dateString, places], index) => (
						<TripGalleryDay
							key={dateString}
							places={places}
							from={trip.from!}
							selectedDate={selectedDate}
							dateString={dateString}
						/>
					))}
					<DragOverlay>
						{activeId ? (
							<TripGalleryCard
								place={trip.places.find((place) => place.placeId === activeId)!}
								isOverlay
							/>
						) : null}
					</DragOverlay>
				</DndContext>
			)}

			{!trip.from &&
				trip.places.map((place, index) => (
					<TripGalleryCard key={index} place={place} />
				))}
		</>
	);

	function handleDragStart(event: DragStartEvent) {
		const data = event.active;

		setActiveId(data.id as string);
	}

	async function handleDragOver(event: DragOverEvent) {
		const { active, over } = event;

		if (!over) return;
		if (!over.data.current) {
			// This means that over a droppable
			if (active.data.current?.sortable.containerId === over.id) return; // This means that the active is in the over container

			const overDateString = over.id as string;
			const overPlaces = trip.places.filter(
				(place) => place.date?.toDateString() === overDateString
			);
			const activePlace = trip.places.find(
				(place) => place.placeId === active.id
			)!;
			const reorderedPlaces = [activePlace, ...overPlaces];

			await reorderPlaces(
				trip.id,
				new Date(overDateString),
				reorderedPlaces.map((place) => place.id)
			);
		} else {
			// This means that over is a card
			if (active.id === over.id) return; // This means that active and over are the same card
			if (
				active.data.current?.sortable.containerId ===
				over.data.current?.sortable.containerId
			)
				return; // This means that the active is in the over container

			const overDateString = over.data.current?.sortable.containerId;
			const overPlaces = trip.places
				.filter((place) => place.date?.toDateString() === overDateString)
				.sort((a, b) => a.sortOrder - b.sortOrder);
			const newPlaces = [
				...overPlaces,
				trip.places.find((place) => place.placeId === active.id)!
			];
			const activeIndex = newPlaces.findIndex(
				(place) => place.placeId === active.id
			);
			const overIndex = newPlaces.findIndex(
				(place) => place.placeId === over.id
			);
			const reorderedPlaces = arrayMove(newPlaces, activeIndex, overIndex);

			await reorderPlaces(
				trip.id,
				new Date(overDateString),
				reorderedPlaces.map((place) => place.id)
			);
		}
	}

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (!over) return;
		if (!over.data.current) return; // This means that over is not a card
		if (active.id === over.id) return; // This means that active and over are the same card

		const overDateString = over.data.current?.sortable.containerId;
		const overPlaces = trip.places
			.filter((place) => place.date?.toDateString() === overDateString)
			.sort((a, b) => a.sortOrder - b.sortOrder);
		const activeIndex = overPlaces.findIndex(
			(place) => place.placeId === active.id
		);
		const overIndex = overPlaces.findIndex(
			(place) => place.placeId === over.id
		);
		const reorderedPlaces = arrayMove(overPlaces, activeIndex, overIndex);

		await reorderPlaces(
			trip.id,
			new Date(overDateString),
			reorderedPlaces.map((place) => place.id)
		);
	}

	function getGroupedPlaces(trip: TripModel): [string, PlaceModel[]][] {
		if (!trip.from || !trip.to) return [];

		const dates = eachDayOfInterval({
			start: new Date(trip.from),
			end: new Date(trip.to)
		});

		const groups = trip.places.reduce((acc, place) => {
			const dateString = place.date?.toDateString();
			if (dateString) {
				if (!acc[dateString]) {
					acc[dateString] = [];
				}
				acc[dateString].push(place);
			}
			return acc;
		}, {} as Record<string, typeof trip.places>);

		return dates.map((date) => [
			date.toDateString(),
			(groups[date.toDateString()]?.sort((a, b) => a.sortOrder - b.sortOrder) ||
				[]) as PlaceModel[]
		]);
	}
}

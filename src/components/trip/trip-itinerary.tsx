"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { TripModel } from "@/lib/types";
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
import { format } from "date-fns";
import { CircleAlert } from "lucide-react";
import { TripItineraryCard } from "./trip-itinerary-card";
import { BoardContainer, TripItineraryColumn } from "./trip-itinierary-column";
import { DndCard, DndColumn } from "./types";
import { coordinateGetter, getDefaultCols, hasDraggableData } from "./utils";

interface TripItineraryProps {
	trip: TripModel;
}

export function TripItinerary({ trip }: TripItineraryProps) {
	const defaultCols = getDefaultCols(trip.from, trip.to);

	const initialCards = trip.places.map((place) => ({
		id: place.id,
		columnId: place.date ? format(place.date, "yyyy-MM-dd") : "",
		content: place
	}));

	const [columns, setColumns] = useState<DndColumn[]>(defaultCols);
	const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

	const [cards, setCards] = useState<DndCard[]>(initialCards);

	const [activeColumn, setActiveColumn] = useState<DndColumn | null>(null);

	const [activeCard, setActiveCard] = useState<DndCard | null>(null);

	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: coordinateGetter
		})
	);

	if (!trip.from || !trip.to) return <TripItineraryNull />;

	return (
		<DndContext
			sensors={sensors}
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			onDragOver={onDragOver}
		>
			<BoardContainer>
				<SortableContext items={columnsId}>
					<TripItineraryColumn
						isSentinel
						column={{ id: "", title: "Gallery" }}
						cards={cards.filter((task) => task.columnId === "")}
					/>
					{columns.map((col) => (
						<TripItineraryColumn
							key={col.id}
							column={col}
							cards={cards.filter((task) => task.columnId === col.id)}
						/>
					))}
				</SortableContext>
			</BoardContainer>

			{"document" in window &&
				createPortal(
					<DragOverlay>
						{activeColumn && (
							<TripItineraryColumn
								isOverlay
								column={activeColumn}
								cards={cards.filter(
									(task) => task.columnId === activeColumn.id
								)}
							/>
						)}
						{activeCard && <TripItineraryCard card={activeCard} isOverlay />}
					</DragOverlay>,
					document.body
				)}
		</DndContext>
	);

	function onDragStart(event: DragStartEvent) {
		if (!hasDraggableData(event.active)) return;
		const data = event.active.data.current;
		if (data?.type === "Column") {
			setActiveColumn(data.column);
			return;
		}

		if (data?.type === "Card") {
			setActiveCard(data.task);
			return;
		}
	}

	function onDragEnd(event: DragEndEvent) {
		setActiveColumn(null);
		setActiveCard(null);

		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		if (!hasDraggableData(active)) return;

		const activeData = active.data.current;

		if (activeId === overId) return;

		const isActiveAColumn = activeData?.type === "Column";
		if (!isActiveAColumn) return;

		setColumns((columns) => {
			const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

			const overColumnIndex = columns.findIndex((col) => col.id === overId);

			return arrayMove(columns, activeColumnIndex, overColumnIndex);
		});
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

		const isActiveATask = activeData?.type === "Card";
		const isOverATask = overData?.type === "Card";

		if (!isActiveATask) return;

		if (isActiveATask && isOverATask) {
			setCards((tasks) => {
				const activeIndex = tasks.findIndex((t) => t.id === activeId);
				const overIndex = tasks.findIndex((t) => t.id === overId);
				const activeTask = tasks[activeIndex];
				const overTask = tasks[overIndex];
				if (
					activeTask &&
					overTask &&
					activeTask.columnId !== overTask.columnId
				) {
					activeTask.columnId = overTask.columnId;
					return arrayMove(tasks, activeIndex, overIndex - 1);
				}

				return arrayMove(tasks, activeIndex, overIndex);
			});
		}

		const isOverAColumn = overData?.type === "Column";

		if (isActiveATask && isOverAColumn) {
			setCards((tasks) => {
				const activeIndex = tasks.findIndex((t) => t.id === activeId);
				const activeTask = tasks[activeIndex];
				if (activeTask) {
					activeTask.columnId = overId as UniqueIdentifier;
					return arrayMove(tasks, activeIndex, activeIndex);
				}
				return tasks;
			});
		}
	}
}

function TripItineraryNull() {
	return (
		<div className="p-3 rounded border text-sm text-muted-foreground flex items-center">
			<CircleAlert className="w-4 h-4 mr-2 text-destructive" />
			Add dates to your trip to use the Kanban Board
		</div>
	);
}

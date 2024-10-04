"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { updatePlace } from "@/actions/actions";
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
import { CircleAlert } from "lucide-react";
import { TripItineraryCard } from "./trip-itinerary-card";
import { BoardContainer, TripItineraryColumn } from "./trip-itinierary-column";
import { DndCard, DndColumn } from "./types";
import {
	coordinateGetter,
	getCards,
	getDefaultCols,
	hasDraggableData
} from "./utils";

interface TripItineraryProps {
	trip: TripModel;
}

export function TripItinerary({ trip }: TripItineraryProps) {
	const initialCards = getCards(trip.places);

	const columns = getDefaultCols(trip.from, trip.to);

	const columnsId = columns.map((col) => col.id);

	const [cards, setCards] = useState<DndCard[]>(initialCards);

	useEffect(() => {
		const galleryCards = cards.filter((c) => c.columnId === "");
		galleryCards.forEach(async (nc, index) => {
			const newOrder = galleryCards.length - index;
			await updatePlace(nc.content.id, {
				date: new Date(nc.columnId),
				dateSortOrder: newOrder
			});
		});

		columns.forEach((col) => {
			const colCards = cards.filter((c) => c.columnId === col.id);
			colCards.forEach(async (nc, index) => {
				const newOrder = colCards.length - index;
				await updatePlace(nc.content.id, {
					date: new Date(nc.columnId),
					dateSortOrder: newOrder
				});
			});
		});
	}, [cards]);

	const [activeCard, setActiveCard] = useState<DndCard | null>(null);
	const [overCard, setOverCard] = useState<DndCard | null>(null);
	const [overColumn, setOverColumn] = useState<DndColumn | null>(null);

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
			<SortableContext items={columnsId}>
				<div className="flex flex-col md:flex-row">
					<TripItineraryColumn
						isSentinel
						column={{ id: "", title: "Gallery" }}
						cards={cards.filter((card) => card.columnId === "")}
						activeCard={activeCard}
						overCard={overCard}
						isOverColumn={overColumn?.id === ""}
					/>
					<BoardContainer>
						{columns.map((col) => (
							<TripItineraryColumn
								key={col.id}
								column={col}
								cards={cards.filter((card) => card.columnId === col.id)}
								activeCard={activeCard}
								overCard={overCard}
								isOverColumn={overColumn?.id === col.id}
							/>
						))}
					</BoardContainer>
				</div>
			</SortableContext>

			{"document" in window &&
				createPortal(
					<DragOverlay>
						{activeCard && <TripItineraryCard card={activeCard} isOverlay />}
					</DragOverlay>,
					document.body
				)}
		</DndContext>
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
		setActiveCard(null);
		setOverCard(null);
		setOverColumn(null);

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

		const isOverAColumn = overData?.type === "Column";

		if (isActiveACard && isOverAColumn) {
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

	function onDragOver(event: DragOverEvent) {
		const { over } = event;
		if (!over) return;

		const overId = over.id;

		if (!hasDraggableData(over)) return;

		const overData = over.data.current;

		const isOverACard = overData?.type === "Card";
		if (isOverACard) {
			const overIndex = cards.findIndex((c) => c.id === overId);
			const overCard = cards[overIndex];
			setOverColumn(null);
			setOverCard(overCard);
		}

		const isOverAColumn = overData?.type === "Column";
		if (isOverAColumn) {
			setOverCard(null);
			setOverColumn(overData.column);
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

"use client";

import { useDndContext } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { cva } from "class-variance-authority";
import { useMemo } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlaceModel } from "@/lib/types";
import { Badge } from "../ui/badge";
import { TripItineraryCard } from "./trip-itinerary-card";
import { DndCard, DndColumn, DndColumnDragData } from "./types";

interface TripItineraryColumnProps {
	column: DndColumn;
	cards: DndCard[];
	activeCard: DndCard | null;
	hoverCard: DndCard | null;
	selectedCard: DndCard | null;
	setHoverId: (id: string | null) => void;
	setSelectedPlace?: (place: PlaceModel | null) => void;
	isSentinel?: boolean;
}

export function TripItineraryColumn({
	column,
	cards,
	activeCard,
	hoverCard,
	selectedCard,
	setHoverId,
	setSelectedPlace,
	isSentinel
}: TripItineraryColumnProps) {
	const cardIds = useMemo(() => {
		return cards.map((card) => card.id);
	}, [cards]);

	const { setNodeRef } = useSortable({
		id: column.id,
		data: {
			type: "Column",
			column
		} satisfies DndColumnDragData,
		attributes: {
			roleDescription: `Column: ${column.title}`
		}
	});

	return (
		<Card
			ref={setNodeRef}
			className={`md:w-[188px] 3xl:w-[240px] p-2 max-w-full shadow-none rounded-md flex flex-col flex-shrink-0 snap-center border-0 ${
				isSentinel && "md:border-r-[1px]"
			}`}
		>
			<CardHeader
				className={`px-0 py-1.5 font-semibold rounded-t border-b text-left flex flex-row space-between items-center cursor-grab transition hover:bg-muted"`}
			>
				<Badge variant={isSentinel ? "default" : "secondary"}>
					{column.title}
				</Badge>
			</CardHeader>
			<ScrollArea>
				<CardContent className="flex flex-grow flex-col gap-2 pt-2 pb-0 px-0">
					<SortableContext items={cardIds}>
						{cards.map((card) => (
							<TripItineraryCard
								key={card.id}
								isSentinel={isSentinel}
								isHoverCard={hoverCard?.id === card.id}
								isSelectedCard={selectedCard?.id === card.id}
								card={card}
								setHoverId={setHoverId}
								setSelectedPlace={setSelectedPlace}
							/>
						))}
					</SortableContext>
				</CardContent>
			</ScrollArea>
		</Card>
	);
}

export function TripItineraryContainer({
	children
}: {
	children: React.ReactNode;
}) {
	const dndContext = useDndContext();

	const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
		variants: {
			dragging: {
				default: "snap-x snap-mandatory",
				active: "snap-none"
			}
		}
	});

	return (
		<ScrollArea
			className={variations({
				dragging: dndContext.active ? "active" : "default"
			})}
		>
			<div className="flex gap-1 flex-col md:flex-row">{children}</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
}

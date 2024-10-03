"use client";

import { useDndContext } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { useMemo } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "../ui/badge";
import { TripItineraryCard } from "./trip-itinerary-card";
import { DndCard, DndColumn, DndColumnDragData } from "./types";

interface TripItineraryColumnProps {
	column: DndColumn;
	cards: DndCard[];
	isOverlay?: boolean;
	isSentinel?: boolean;
}

export function TripItineraryColumn({
	column,
	cards,
	isOverlay,
	isSentinel
}: TripItineraryColumnProps) {
	const tasksIds = useMemo(() => {
		return cards.map((task) => task.id);
	}, [cards]);

	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging
	} = useSortable({
		id: column.id,
		data: {
			type: "Column",
			column
		} satisfies DndColumnDragData,
		attributes: {
			roleDescription: `Column: ${column.title}`
		}
	});

	const style = {
		transition,
		transform: CSS.Translate.toString(transform)
	};

	const variants = cva(
		`w-[240px] p-2 max-w-full shadow-none rounded-md flex flex-col flex-shrink-0 snap-center border-0 ${
			isSentinel && "bg-muted"
		}`,
		{
			variants: {
				dragging: {
					default: "border-2 border-transparent",
					over: "ring-2 opacity-30",
					overlay: "ring-2 ring-primary"
				}
			}
		}
	);

	return (
		<Card
			ref={setNodeRef}
			style={style}
			className={variants({
				dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined
			})}
		>
			<CardHeader
				className="px-0 py-1.5 font-semibold rounded-t border-b text-left flex flex-row space-between items-center cursor-grab transition hover:bg-muted"
				{...attributes}
				{...listeners}
			>
				<Badge variant={isSentinel ? "default" : "secondary"}>
					{column.title}
				</Badge>
			</CardHeader>
			<ScrollArea>
				<CardContent className="flex flex-grow flex-col gap-2 pt-2 pb-0 px-0">
					<SortableContext items={tasksIds}>
						{cards.map((task) => (
							<TripItineraryCard
								key={task.id}
								card={task}
								isSentinel={isSentinel}
							/>
						))}
					</SortableContext>
				</CardContent>
			</ScrollArea>
		</Card>
	);
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
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
			<div className="flex gap-1 flex-row">{children}</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
}

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cva } from "class-variance-authority";
import { DndCard, DndCardDragData } from "./types";

interface TripItineraryCardProps {
	card: DndCard;
	isOverlay?: boolean;
	isSentinel?: boolean;
}

export function TripItineraryCard({
	card,
	isOverlay,
	isSentinel
}: TripItineraryCardProps) {
	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging
	} = useSortable({
		id: card.id,
		data: {
			type: "Card",
			task: card
		} satisfies DndCardDragData,
		attributes: {
			roleDescription: "Card"
		}
	});

	const style = {
		transition,
		transform: CSS.Translate.toString(transform)
	};

	const variants = cva(
		`w-full rounded-md cursor-grab shadow-none transition hover:bg-muted ${
			isSentinel && "bg-muted"
		}`,
		{
			variants: {
				dragging: {
					over: "border opacity-30",
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
			{...attributes}
			{...listeners}
		>
			<CardHeader className="px-3 pt-2 pb-1 text-sm font-semibold">
				{card.content.name}
			</CardHeader>
			<CardContent className="px-3 pt-0 pb-2 text-left whitespace-pre-wrap text-xs text-muted-foreground">
				<p className="text-xs text-muted-foreground text-ellipsis overflow-hidden line-clamp-1">
					{card.content.formattedAddress}
				</p>
			</CardContent>
		</Card>
	);
}

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlaceModel } from "@/lib/types";
import { cva } from "class-variance-authority";
import { DndCard, DndCardDragData } from "./types";

interface TripItineraryCardProps {
	card: DndCard;
	setHoverId: (id: string | null) => void;
	setSelectedPlace?: (place: PlaceModel | null) => void;
	isHoverCard?: boolean;
	isSelectedCard?: boolean;
	isOverlay?: boolean;
	isSentinel?: boolean;
}

export function TripItineraryCard({
	card,
	setHoverId,
	setSelectedPlace,
	isHoverCard,
	isSelectedCard,
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
			isSentinel && "bg-muted border-t-none border-l-none border-r-none"
		} ${isSentinel && "bg-muted border-none"} ${
			(isHoverCard || isSelectedCard) && "bg-muted"
		}`,
		{
			variants: {
				dragging: {
					drag: "border opacity-30",
					overlay: "ring-2 ring-primary opacity-70"
				}
			}
		}
	);

	return (
		<Card
			ref={setNodeRef}
			style={style}
			className={variants({
				dragging: isOverlay ? "overlay" : isDragging ? "drag" : undefined
			})}
			{...attributes}
			{...listeners}
			onMouseEnter={() => setHoverId(card.id as string)}
			onMouseLeave={() => setHoverId(null)}
			onMouseDownCapture={() =>
				setSelectedPlace && setSelectedPlace(card.content)
			}
		>
			<CardHeader className="px-3 pt-2 pb-1 text-xs font-semibold">
				{card.content.name}
			</CardHeader>
			<CardContent className="px-3 pt-0 pb-2 text-left whitespace-pre-wrap">
				<p className="text-xs text-muted-foreground text-ellipsis overflow-hidden line-clamp-3 font-light">
					{card.content.formattedAddress}
				</p>
			</CardContent>
		</Card>
	);
}

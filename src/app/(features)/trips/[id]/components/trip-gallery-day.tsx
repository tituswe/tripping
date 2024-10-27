"use client";

import { Badge } from "@/components/ui/badge";
import { PlaceModel } from "@/lib/types";
import { useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { differenceInDays, format } from "date-fns";
import { TripGalleryCard } from "./trip-gallery-card";

interface TripGalleryDayProps {
	places: PlaceModel[];
	from: Date;
	selectedDate: Date | null;
	dateString: string;
}

export function TripGalleryDay({
	places,
	from,
	selectedDate,
	dateString
}: TripGalleryDayProps) {
	const { setNodeRef } = useDroppable({ id: dateString });

	return (
		<div ref={setNodeRef}>
			<SortableContext
				id={dateString}
				items={places.map((place) => place.placeId)}
				strategy={verticalListSortingStrategy}
			>
				<TripGalleryDayTitle
					from={from}
					dateString={dateString}
					selectedDate={selectedDate}
				/>
				{places.map((place) => (
					<TripGalleryCard key={place.placeId} place={place} />
				))}
				{places.length === 0 && (
					<div className="text-center p-1.5">
						<p className="text-xs text-muted-foreground font-light">
							No places added
						</p>
					</div>
				)}
			</SortableContext>
		</div>
	);
}

interface TripGalleryDayTitleProps {
	from: Date;
	dateString: string;
	selectedDate: Date | null;
}

function TripGalleryDayTitle({
	from,
	dateString,
	selectedDate
}: TripGalleryDayTitleProps) {
	return (
		<div className="flex flex-row justify-between items-center mt-5 mx-6 mb-0">
			<Badge
				variant={
					selectedDate?.toDateString() === dateString ? "default" : "secondary"
				}
			>
				Day {differenceInDays(new Date(dateString), from)}
			</Badge>
			<div className="flex-grow border-b mx-3" />
			<label className="text-xs font-semibold text-muted-foreground">
				{format(new Date(dateString), "EEEE")}
			</label>
		</div>
	);
}

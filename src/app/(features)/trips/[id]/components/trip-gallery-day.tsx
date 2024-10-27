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
	id: string;
	places: PlaceModel[];
	from: Date;
	selectedDate: Date | null;
	setSelectedDate: (day: Date | null) => void;
	dateString: string;
}

export function TripGalleryDay({
	id,
	places,
	from,
	selectedDate,
	setSelectedDate,
	dateString
}: TripGalleryDayProps) {
	const { setNodeRef } = useDroppable({ id: dateString });

	return (
		<div ref={setNodeRef} id={id} className="scroll-mt-16">
			<SortableContext
				id={dateString}
				items={places.map((place) => place.placeId)}
				strategy={verticalListSortingStrategy}
			>
				<TripGalleryDayTitle
					from={from}
					dateString={dateString}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
				/>
				{places.map((place) => (
					<TripGalleryCard key={place.placeId} place={place} />
				))}
				{places.length === 0 && (
					<div className="text-center px-1.5 pb-1.5">
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
	setSelectedDate: (day: Date | null) => void;
}

function TripGalleryDayTitle({
	from,
	dateString,
	selectedDate,
	setSelectedDate
}: TripGalleryDayTitleProps) {
	return (
		<div
			className="flex flex-row justify-between items-center my-3.5 py-1.5 mx-3 px-3 mb-0 cursor-pointer transition hover:bg-muted"
			onClick={() => {
				setSelectedDate(new Date(dateString));
				const element = document.getElementById(dateString);
				element?.scrollIntoView({ behavior: "smooth", block: "start" });
			}}
		>
			<Badge
				variant={
					selectedDate?.toDateString() === dateString ? "default" : "secondary"
				}
			>
				Day {differenceInDays(new Date(dateString), from) + 1}
			</Badge>
			<div className="flex-grow border-b mx-3" />
			<label className="text-xs font-semibold text-muted-foreground">
				{format(new Date(dateString), "EEEE")}
			</label>
		</div>
	);
}

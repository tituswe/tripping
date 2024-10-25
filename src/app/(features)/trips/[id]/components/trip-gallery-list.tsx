"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TripModel } from "@/lib/types";
import { differenceInDays, format } from "date-fns";
import { TripDayTabs } from "./trip-day-tabs";
import { TripGalleryCard } from "./trip-gallery-card";

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
	const groupedPlaces = Object.entries(
		trip.places.reduce((acc, place) => {
			const dateString = place.date?.toDateString();
			if (dateString) {
				if (!acc[dateString]) {
					acc[dateString] = [];
				}
				acc[dateString].push(place);
			}
			return acc;
		}, {} as Record<string, typeof trip.places>)
	).sort((a, b) => {
		return differenceInDays(new Date(a[0]), new Date(b[0]));
	});

	return (
		<>
			<div className="sticky top-0 pt-3 space-y-1.5 px-5 bg-background duration-700 ease-in-out">
				<TripDayTabs
					trip={trip}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
				/>
				<div className="h-1" />
				<Separator />
			</div>

			<div>
				{trip.from
					? groupedPlaces.map(([dateString, places], index) => (
							<div key={index}>
								<div className="flex flex-row justify-between items-center mt-5 mx-6 mb-0">
									<Badge
										variant={
											selectedDate?.toDateString() === dateString
												? "default"
												: "secondary"
										}
									>
										Day {differenceInDays(new Date(dateString), trip.from!)}
									</Badge>
									<div className="flex-grow border-b mx-3" />
									<label className="text-xs font-semibold text-muted-foreground">
										{format(new Date(dateString), "EEEE")}
									</label>
								</div>
								{places.map((place, index) => (
									<TripGalleryCard key={index} place={place} />
								))}
							</div>
					  ))
					: trip.places.map((place, index) => (
							<TripGalleryCard key={index} place={place} />
					  ))}
			</div>
		</>
	);
}

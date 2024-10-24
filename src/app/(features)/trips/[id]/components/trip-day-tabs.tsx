"use client";

import { eachDayOfInterval } from "date-fns";

import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from "@/components/ui/carousel";
import { TripModel } from "@/lib/types";

interface TripDayTabsProps {
	trip: TripModel;
	selectedDay: number;
	setSelectedDay: (day: number) => void;
}

export function TripDayTabs({
	trip,
	selectedDay,
	setSelectedDay
}: TripDayTabsProps) {
	const days = eachDayOfInterval({
		start: new Date(trip.from || Date.now()),
		end: new Date(trip.to || Date.now())
	}).map((_, index) => index + 1);

	return (
		<div className="w-full flex justify-center">
			<Carousel
				opts={{
					align: "start"
				}}
				className="w-[264px] rounded-full"
			>
				<CarouselPrevious size="smIcon" variant="ghost" />
				<CarouselContent>
					{days.map((day, index) => (
						<CarouselItem key={index} className="basis-1/9">
							<Button
								size="smIcon"
								variant={selectedDay === day ? "default" : "secondary"}
								onClick={() => setSelectedDay(day)}
							>
								<p className="text-xs font-normal">{day}</p>
							</Button>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselNext size="smIcon" variant="ghost" />
			</Carousel>
		</div>
	);
}

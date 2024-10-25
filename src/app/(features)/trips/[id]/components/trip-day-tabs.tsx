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
	selectedDate: Date | null;
	setSelectedDate: (day: Date | null) => void;
}

export function TripDayTabs({
	trip,
	selectedDate,
	setSelectedDate
}: TripDayTabsProps) {
	const dates = eachDayOfInterval({
		start: new Date(trip.from || Date.now()),
		end: new Date(trip.to || Date.now())
	});

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
					{dates.map((date, index) => (
						<CarouselItem key={index} className="basis-1/9">
							<Button
								size="smIcon"
								variant={
									selectedDate?.toDateString() === date.toDateString()
										? "default"
										: "secondary"
								}
								onClick={() => setSelectedDate(date)}
							>
								<p className="text-xs font-normal">{index + 1}</p>
							</Button>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselNext size="smIcon" variant="ghost" />
			</Carousel>
		</div>
	);
}

"use client";

import { differenceInDays, eachDayOfInterval } from "date-fns";

import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from "@/components/ui/carousel";
import { TripModel } from "@/lib/types";
import { useEffect, useRef, useState } from "react";

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

	const [startDay, setStartDay] = useState(1);
	const [endDay, setEndDay] = useState(7);

	const nextRef = useRef<HTMLButtonElement>(null);
	const previousRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!selectedDate || !trip.from) return;

		const selectedDay = differenceInDays(selectedDate, new Date(trip.from)) + 1;

		if (selectedDay > endDay) {
			for (let i = 0; i < selectedDay - endDay; i++) {
				setTimeout(() => {
					nextRef.current?.click();
				}, 100);
			}
		}

		if (selectedDay < startDay) {
			for (let i = 0; i < startDay - selectedDay; i++) {
				setTimeout(() => {
					previousRef.current?.click();
				}, 100);
			}
		}
	}, [selectedDate]);

	return (
		<div className="w-full flex justify-center">
			<Carousel
				opts={{
					align: "start"
				}}
				className="w-[264px] rounded-full"
			>
				<CarouselPrevious
					ref={previousRef}
					size="smIcon"
					variant="ghost"
					onClickCapture={() => {
						setStartDay(startDay - 1);
						setEndDay(endDay - 1);
					}}
				/>
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
				<CarouselNext
					ref={nextRef}
					size="smIcon"
					variant="ghost"
					onClickCapture={() => {
						setStartDay(startDay + 1);
						setEndDay(endDay + 1);
					}}
				/>
			</Carousel>
		</div>
	);
}

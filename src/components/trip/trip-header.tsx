"use client";

import { CalendarDays, Plane } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { DateRange } from "react-day-picker";

import { updateTrip } from "@/actions/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import { TripModel } from "@/lib/types";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

interface TripHeaderProps {
	trip: TripModel;
}

export function TripHeader({ trip }: TripHeaderProps) {
	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: undefined,
		to: undefined
	});

	const onCloseAutoFocus = async () => {
		await updateTrip(trip.id, { from: dateRange?.from, to: dateRange?.to });
	};

	return (
		<>
			<Image
				src={trip.location.photos[0]}
				height={200}
				width={1000}
				alt={trip.location.name || "background-image"}
				priority
				className="w-full h-[200px] object-cover"
			/>
			<Alert className="rounded-none border-t-0 border-l-0 border-r-0">
				<Plane className="h-6 w-6 mt-1" />
				<AlertTitle className="ml-2 font-semibold text-2xl mt-1">
					Your trip to {trip.location.name}
				</AlertTitle>
				<AlertDescription className="ml-2 space-x-2">
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="ghost"
								className="text-muted-foreground transition hover:text-primary cursor-pointer pl-3"
							>
								<CalendarDays className="mr-2 h-4 w-4" />
								{trip.from && trip.to ? (
									<span className="flex space-x-1 border-l pl-2">
										<span className="hidden md:block">Gone from</span>
										<b className="hidden md:block">
											{format(trip.from, "PPP")}
										</b>
										<b className="md:hidden">
											{format(trip.from, "MMM d, yyyy")}
										</b>
										<span>to</span>
										<b className="hidden md:block">{format(trip.to, "PPP")}</b>
										<b className="md:hidden">
											{format(trip.to, "MMM d, yyyy")}
										</b>
									</span>
								) : (
									<span className="border-l pl-2 mr-[472px]">Add dates</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent
							className="w-full p-0"
							align="start"
							onCloseAutoFocus={onCloseAutoFocus}
						>
							<Calendar
								initialFocus
								mode="range"
								defaultMonth={dateRange?.from}
								selected={dateRange}
								onSelect={setDateRange}
								numberOfMonths={2}
							/>
						</PopoverContent>
					</Popover>
				</AlertDescription>
			</Alert>
		</>
	);
}

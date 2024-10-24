"use client";

import { TripModel } from "@/lib/types";
import { format } from "date-fns";
import { CalendarDays, Ellipsis } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

import { updateTrip } from "@/actions/actions";
import { AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";

interface TripDatesProps {
	trip: TripModel;
}

export function TripDates({ trip }: TripDatesProps) {
	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: trip.from || undefined,
		to: trip.to || undefined
	});

	const onCloseAutoFocus = async () => {
		await updateTrip(trip.id, {
			from: dateRange?.from,
			to: dateRange?.to
		});
	};

	return (
		<AlertDescription className="space-x-2">
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						className="text-muted-foreground transition text-xs hover:text-primary cursor-pointer pl-3"
					>
						<CalendarDays className="mr-2 h-3.5 w-3.5" />
						{trip.from && trip.to ? (
							<span className="flex space-x-1 border-l pl-2 items-end">
								<p>{format(trip.from, "MMM d")}</p>
								<Ellipsis className="h-3 w-3" />
								<p>{format(trip.to, "MMM d, yyyy")}</p>
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
	);
}

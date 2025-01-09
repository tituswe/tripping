"use client";

import { format } from "date-fns";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateTimeInputProps extends React.HTMLAttributes<HTMLDivElement> {
	dateRange: DateRange | undefined;
	setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

export function DateTimeInput({
	className,
	dateRange,
	setDateRange
}: DateTimeInputProps) {
	return (
		<div className={cn("grid gap-2", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn(
							"w-full h-12 shadow-sm rounded-l-full md:rounded-l-none rounded-r-full justify-start text-left font-normal",
							!dateRange && "text-muted-foreground"
						)}
					>
						{
							<div className="w-full flex justify-evenly text-md text-muted-foreground">
								<span
									className={`flex-grow border-r w-28 pl-1.5 ${
										dateRange?.from && "text-primary"
									}`}
								>
									{dateRange?.from
										? format(dateRange.from, "LLL dd, y")
										: "From"}
								</span>
								<span
									className={`flex-grow w-28 ml-4 ${
										dateRange?.to && "text-primary"
									}`}
								>
									{dateRange?.to ? format(dateRange.to, "LLL dd, y") : "To"}
								</span>
							</div>
						}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0" align="start">
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
		</div>
	);
}

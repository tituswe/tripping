"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useHandleCopy } from "@/hooks/use-handle-copy";
import { PlaceModel, TripModel } from "@/lib/types";
import { snakeToNormalCase } from "@/lib/utils";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { Clock, Copy, MapPin } from "lucide-react";
import { useState } from "react";

interface TripMapWidgetProps {
	trip: TripModel;
	selectedPlace: PlaceModel | null;
}

export function TripMapWidget({ trip, selectedPlace }: TripMapWidgetProps) {
	const [isShowingTimes, setIsShowingTimes] = useState(false);

	const { handleCopy } = useHandleCopy(
		selectedPlace?.formattedAddress,
		"Address copied!"
	);

	if (!selectedPlace) return null;

	return (
		<div className="hidden md:block absolute z-50 bottom-0 w-full flex justify-center p-4">
			<Card className="w-full">
				<CardContent className="p-4">
					<div className="flex flex-col text-sm font-light text-muted-foreground space-y-1">
						<h3 className="text-primary text-lg font-semibold">
							{selectedPlace?.name}
						</h3>
						<Separator />
						<ScrollArea className="w-full whitespace-nowrap">
							<div className="flex w-max space-x-3 my-1">
								{selectedPlace?.tags.map((tag, index) => (
									<Badge
										key={index}
										variant="outline"
										className="font-medium text-muted-foreground"
									>
										{snakeToNormalCase(tag)}
									</Badge>
								))}
							</div>
							<ScrollBar orientation="horizontal" />
						</ScrollArea>
						<div className="flex items-center">
							<StarFilledIcon className="h-4 w-4 mr-1 text-yellow-500" />
							<p className="font-semibold">
								{selectedPlace?.rating}{" "}
								<span className="font-light">
									({selectedPlace?.userRatingsTotal})
								</span>
							</p>
						</div>
						<button
							className="flex items-center transition hover:bg-muted cursor-pointer"
							onClick={handleCopy}
						>
							<MapPin className="h-4 w-4 mr-1 flex-shrink-0 cursor-pointer" />
							<p className="line-clamp-1 text-ellipsis overflow-x-hidden cursor-pointer">
								{selectedPlace?.formattedAddress}
							</p>
							<Copy className="h-4 w-4 ml-auto flex-shrink-0 cursor-pointer" />
						</button>
						<div className="flex items-start pb-1">
							<Clock className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
							<p className="flex flex-col">
								<span className="flex">
									<span>{selectedPlace?.openingHours[0]}</span>
									<button
										className="ml-1 font-normal text-blue-500"
										onClick={() => setIsShowingTimes(!isShowingTimes)}
									>
										Show times...
									</button>
								</span>
								{isShowingTimes &&
									selectedPlace?.openingHours
										.slice(1)
										.map((time, index) => <span key={index}>{time}</span>)}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

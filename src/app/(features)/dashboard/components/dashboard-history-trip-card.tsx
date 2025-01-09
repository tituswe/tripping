"use client";

import { TripModel } from "@/lib/types";
import { format } from "date-fns";
import { MapPin } from "lucide-react";

import { GooglePhoto } from "@/components/admin-panel/google-photo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { DashboardOptionsDropdown } from "./dashboard-options-dropdown";

interface DashboardHistoryTripCardProps {
	trip: TripModel;
}

export function DashboardHistoryTripCard({
	trip
}: DashboardHistoryTripCardProps) {
	return (
		<Link
			href={`/trips/${trip.id}`}
			className="relative flex cursor-pointer rounded-lg group"
		>
			<GooglePhoto
				placeId={trip.location.placeId}
				className="w-[80px] h-[80px] aspect-square rounded-lg"
			/>
			<div className="flex flex-row items-center ml-4 flex-grow">
				<div className="mt-2">
					<span className="text-md font-medium line-clamp-1 text-ellipsis">
						{trip.title || `Trip to ${trip.location.name}`}
					</span>
					<div className="flex flex-col space-y-3 text-xs font-light text-muted-foreground truncate line-clamp-1 text-ellipsis">
						{trip.places.length > 0 && (
							<div className="flex items-center">
								<MapPin className="mr-0.5 h-3 w-3 flex-shrink-0" />
								<p>
									{trip.places.length <= 99 ? trip.places.length : "99+"} places
								</p>
							</div>
						)}
						{trip.places.length <= 0 && <p>No places added</p>}
						{trip.from && trip.to && (
							<p className="font-medium">
								{format(trip.from, "MMM dd, yyyy")} -{" "}
								{format(trip.to, "MMM dd, yyyy")}
							</p>
						)}
					</div>
				</div>
				<Avatar className="absolute right-1.5 bottom-1.5 h-6 w-6 outline outline-1 outline-muted-foreground">
					<AvatarImage src={trip.creator.image || ""} alt="Avatar" />
					<AvatarFallback className="bg-muted text-xs">
						{trip.creator.name?.charAt(0)}
					</AvatarFallback>
				</Avatar>
			</div>
			<DashboardOptionsDropdown trip={trip} />
		</Link>
	);
}

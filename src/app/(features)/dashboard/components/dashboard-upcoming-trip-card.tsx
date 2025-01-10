"use client";

import { GooglePhoto } from "@/components/admin-panel/google-photo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TripModel } from "@/lib/types";
import Link from "next/link";
import { DashboardOptionsDropdown } from "./dashboard-options-dropdown";

interface DashboardUpcomingTripCardProps {
	trip: TripModel;
}

export function DashboardUpcomingTripCard({
	trip
}: DashboardUpcomingTripCardProps) {
	return (
		<li className="relative flex flex-col justify-center items-center overflow-hidden">
			<Link href="/trips/[id]" as={`/trips/${trip.id}`}>
				<GooglePhoto
					placeId={trip.location.placeId}
					className="w-[112px] h-[112px] aspect-square rounded-lg"
				/>
				<p className="text-sm font-medium text-center w-full truncate px-1 mt-2">
					{trip.title || trip.location.name}
				</p>
			</Link>
			<DashboardOptionsDropdown trip={trip} />
		</li>
	);
}

export function DashboardUpcomingTripCardHorizontal({
	trip
}: DashboardUpcomingTripCardProps) {
	return (
		<li className="flex border-b pb-3">
			<Link
				href="/trips/[id]"
				as={`/trips/${trip.id}`}
				className="flex flex-grow justify-between items-center"
			>
				<div className="flex items-center">
					<GooglePhoto
						width={80}
						height={80}
						placeId={trip.location.placeId}
						className="w-[80px] h-[80px] aspect-square rounded-lg"
					/>
					<div className="ml-3">
						<p className="text-md">
							{trip.title || `Trip to ${trip.location.name}`}
						</p>
						<p className="text-sm text-muted-foreground">
							{trip.location.name}
						</p>
					</div>
				</div>

				<Avatar className="absolute right-0.5 bottom-7 h-7 w-7">
					<AvatarImage src={trip.creator.image || ""} alt="Avatar" />
					<AvatarFallback className="bg-muted">
						{trip.creator.name?.charAt(0)}
					</AvatarFallback>
				</Avatar>
				<DashboardOptionsDropdown trip={trip} className="right-1 top-4" />
			</Link>
		</li>
	);
}

"use client";

import { TripModel } from "@/lib/types";
import { format } from "date-fns";
import { Dot, Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface DashboardTripCardProps {
	trip: TripModel;
}

export function DashboardTripCard({ trip }: DashboardTripCardProps) {
	const router = useRouter();
	const imageUrl = trip.location.photos[0] || "";

	return (
		<div
			className="relative flex flex-col cursor-pointer rounded-lg group"
			onClick={() => router.push(`/trips/${trip.id}`)}
		>
			<div className="w-full h-full aspect-square overflow-hidden rounded-lg">
				{imageUrl ? (
					<img
						src={imageUrl}
						alt={"place-image"}
						className="w-full h-full object-cover rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rounded-lg"
					/>
				) : (
					<div className="bg-muted w-full h-full rounded-lg shadow-sm" />
				)}
			</div>
			<div className="mt-2">
				<label className="text-sm font-medium line-clamp-1 text-ellipsis">
					{trip.title || `Trip to ${trip.location.name}`}
				</label>
				<div className="flex items-center text-xs font-light text-muted-foreground truncate line-clamp-1 text-ellipsis">
					{trip.from && <p>{format(trip.from, "MMM dd, yyyy")}</p>}
					{trip.from && <Dot className="h-4 w-4 flex-shrink-0" />}
					{trip.places.length > 0 && <p>{trip.places.length} Places</p>}
					{trip.places.length <= 0 && <p>No places added</p>}
				</div>
			</div>

			<Button
				variant={"secondary"}
				size="xs"
				className="absolute right-1.5 top-1.5 rounded-full"
			>
				<Ellipsis className="w-3 h-3" />{" "}
			</Button>
		</div>
	);
}

"use client";

import { GooglePhoto } from "@/components/admin-panel/google-photo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PlaceModel } from "@/lib/types";
import { snakeToNormalCase } from "@/lib/utils";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { X } from "lucide-react";

interface TripGalleryCardProps {
	place: PlaceModel;
}

export function TripGalleryCard({ place: place }: TripGalleryCardProps) {
	return (
		<div className="p-3 m-3 rounded-md transition hover:bg-muted cursor-grab">
			<div className="flex flex-row rounded-md w-full overflow-hidden">
				<GooglePhoto placeId={place.placeId} width={80} height={80} />

				<div className="ml-3 flex flex-col">
					<h3 className="text-sm font-medium">{place.name || "Unamed"}</h3>
					<div className="flex flex-row items-center space-x-0.5 my-1.5">
						<StarFilledIcon className="w-2.5 h-2.5 text-yellow-400" />
						<p className="text-2xs">{place.rating || "No rating"}</p>
						<p className="text-2xs text-muted-foreground">
							({place.userRatingsTotal || "0"})
						</p>
					</div>
					<p className="text-xs text-muted-foreground mb-0.5">
						{place.district || place.city || "No address"}
					</p>
					<p className="text-xs text-muted-foreground">
						{snakeToNormalCase(place.tags[0]) || "No label"}
					</p>
				</div>

				<div className="ml-auto flex flex-col space-y-2 items-center">
					<Button size="smIcon" variant="destructiveGhost">
						<X className="w-4 h-4" />
					</Button>
					<Checkbox className="rounded-full transition hover:ring-4 hover:ring-muted-foreground m-1 border-muted-foreground" />
				</div>
			</div>
		</div>
	);
}

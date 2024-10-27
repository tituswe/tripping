"use client";

import { GooglePhoto } from "@/components/admin-panel/google-photo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PlaceModel } from "@/lib/types";
import { snakeToNormalCase } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { CalendarSearch, X } from "lucide-react";

interface TripGalleryCardProps {
	place: PlaceModel;
	isOverlay?: boolean;
}

export function TripGalleryCard({ place, isOverlay }: TripGalleryCardProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({ id: place.placeId });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`relative p-3 mx-3 my-1.5 rounded-md transition hover:bg-muted cursor-grab ${
				isDragging ? "opacity-20" : isOverlay ? "opacity-80" : ""
			}`}
		>
			<div
				{...attributes}
				{...listeners}
				className="flex flex-row rounded-md w-full overflow-hidden cursor-grab"
			>
				<GooglePhoto placeId={place.placeId} width={80} height={80} />

				<div className="ml-3 flex flex-col">
					<h3 className="text-sm font-medium">{place.name || "Unamed"}</h3>
					<div className="flex flex-row items-center space-x-1 my-1.5">
						<StarFilledIcon className="w-3 h-3 text-yellow-400" />
						<p className="text-xs font-light">{place.rating || "No rating"}</p>
						<p className="text-xs font-light text-muted-foreground">
							({place.userRatingsTotal || "0"})
						</p>
					</div>
					<p className="text-xs text-muted-foreground font-medium mb-0.5">
						{place.district || place.city || "No address"}
					</p>
					<p className="text-xs text-muted-foreground">
						{snakeToNormalCase(place.tags[0]) || "No label"}
					</p>
				</div>
			</div>

			<div
				className="absolute top-3 right-3 flex flex-col justify-between items-center mt-0.5 space-y-2"
				onClick={(e) => e.stopPropagation()}
			>
				<Button
					size="smIcon"
					variant="secondaryGhost"
					onClick={(e) => e.stopPropagation()}
				>
					<CalendarSearch className="w-3.5 h-3.5" />
				</Button>
				<Checkbox
					className="rounded-full transition hover:ring-4 hover:ring-muted-foreground hover:bg-muted-foreground m-1 border-muted-foreground data-[state=checked]:bg-muted-foreground data-[state=checked]:text-primary-foreground data-[state=checked]:ring-muted-foreground data-[state=checked]:ring-4"
					onClick={(e) => e.stopPropagation()}
				/>
				<Button
					size="smIcon"
					variant="destructiveGhost"
					onClick={(e) => e.stopPropagation()}
				>
					<X className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}

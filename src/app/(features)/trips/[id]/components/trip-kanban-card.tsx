"use client";

import { deletePlace } from "@/actions/actions";
import { GooglePhoto } from "@/components/admin-panel/google-photo";
import { PlaceModel } from "@/lib/types";
import { snakeToNormalCase } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";

interface TripKanbanCardProps {
	place: PlaceModel;
	isOverlay?: boolean;
}

export function TripKanbanCard({ place, isOverlay }: TripKanbanCardProps) {
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
			className={`relative p-3 my-1.5 rounded-md transition hover:bg-muted cursor-grab group ${
				isDragging ? "opacity-20" : isOverlay ? "opacity-80" : ""
			}`}
		>
			<div
				{...attributes}
				{...listeners}
				className="flex flex-col rounded-md w-full overflow-hidden cursor-grab"
			>
				<GooglePhoto placeId={place.placeId} width={224} />

				<div className="flex flex-col">
					<h3 className="text-sm font-medium my-1 mr-6">
						{place.name || "Unamed"}
					</h3>
					<div className="flex justify-between items-center">
						<p className="text-xs text-muted-foreground font-medium mb-0.5">
							{place.district || place.city || "-"}
						</p>
						<p className="text-xs text-muted-foreground">
							{snakeToNormalCase(place.tags[0]) || "-"}
						</p>
					</div>
				</div>
			</div>
			<button
				className="absolute -top-2 -right-2 p-0.5 cursor-pointer rounded-full text-white transition group-hover:bg-rose-400 hover:scale-125"
				onClick={(e) => {
					e.stopPropagation();
					onPlaceDelete();
				}}
			>
				<X className="text-white/0 w-4 h-4 group-hover:text-white/100" />
			</button>
		</div>
	);

	async function onPlaceDelete() {
		await deletePlace(place.id);
	}
}

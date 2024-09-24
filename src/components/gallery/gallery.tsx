"use client";

import { TripItem } from "@prisma/client";
import { GalleryCard } from "./gallery-card";

interface GalleryProps {
	data: TripItem[];
	tripTitle: string;
}

export function Gallery({ data, tripTitle }: GalleryProps) {
	return (
		<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full py-4">
			{data.map((item) => (
				<GalleryCard key={item.id} item={item} />
			))}
		</div>
	);
}

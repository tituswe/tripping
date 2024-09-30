"use client";

import { SortableContext } from "@dnd-kit/sortable";
import { Item } from "../kanban-board/types";
import { GalleryCard } from "./gallery-card";

interface GalleryProps {
	data: Item[];
}

export function Gallery({ data }: GalleryProps) {
	const items = data.filter((item) => item.columnId === "unbound");

	const itemsIds = items.map((item) => item.id);

	return (
		<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full py-4">
			<SortableContext items={itemsIds}>
				{items.map((item) => (
					<GalleryCard key={item.id} item={item} />
				))}
			</SortableContext>
		</div>
	);
}

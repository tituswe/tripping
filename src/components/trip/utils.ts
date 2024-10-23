import {
	Active,
	closestCorners,
	DataRef,
	DroppableContainer,
	getFirstCollision,
	KeyboardCode,
	KeyboardCoordinateGetter,
	Over
} from "@dnd-kit/core";

import { PlaceModel } from "@/lib/types";
import { addDays, differenceInDays, format } from "date-fns";
import { DndCard, DndColumn, DndDraggableData } from "./types";

const directions: string[] = [
	KeyboardCode.Down,
	KeyboardCode.Right,
	KeyboardCode.Up,
	KeyboardCode.Left
];

export const coordinateGetter: KeyboardCoordinateGetter = (
	event,
	{ context: { active, droppableRects, droppableContainers, collisionRect } }
) => {
	if (directions.includes(event.code)) {
		event.preventDefault();

		if (!active || !collisionRect) {
			return;
		}

		const filteredContainers: DroppableContainer[] = [];

		droppableContainers.getEnabled().forEach((entry) => {
			if (!entry || entry?.disabled) {
				return;
			}

			const rect = droppableRects.get(entry.id);

			if (!rect) {
				return;
			}

			const data = entry.data.current;

			if (data) {
				const { type, children } = data;

				if (type === "Column" && children?.length > 0) {
					if (active.data.current?.type !== "Column") {
						return;
					}
				}
			}

			switch (event.code) {
				case KeyboardCode.Down:
					if (active.data.current?.type === "Column") {
						return;
					}
					if (collisionRect.top < rect.top) {
						// find all droppable areas below
						filteredContainers.push(entry);
					}
					break;
				case KeyboardCode.Up:
					if (active.data.current?.type === "Column") {
						return;
					}
					if (collisionRect.top > rect.top) {
						// find all droppable areas above
						filteredContainers.push(entry);
					}
					break;
				case KeyboardCode.Left:
					if (collisionRect.left >= rect.left + rect.width) {
						// find all droppable areas to left
						filteredContainers.push(entry);
					}
					break;
				case KeyboardCode.Right:
					// find all droppable areas to right
					if (collisionRect.left + collisionRect.width <= rect.left) {
						filteredContainers.push(entry);
					}
					break;
			}
		});
		const collisions = closestCorners({
			active,
			collisionRect: collisionRect,
			droppableRects,
			droppableContainers: filteredContainers,
			pointerCoordinates: null
		});
		const closestId = getFirstCollision(collisions, "id");

		if (closestId != null) {
			const newDroppable = droppableContainers.get(closestId);
			const newNode = newDroppable?.node.current;
			const newRect = newDroppable?.rect.current;

			if (newNode && newRect) {
				return {
					x: newRect.left,
					y: newRect.top
				};
			}
		}
	}

	return undefined;
};

export function hasDraggableData<T extends Active | Over>(
	entry: T | null | undefined
): entry is T & {
	data: DataRef<DndDraggableData>;
} {
	if (!entry) {
		return false;
	}

	const data = entry.data.current;

	if (data?.type === "Column" || data?.type === "Card") {
		return true;
	}

	return false;
}

export function getDefaultCols(
	from: Date | null,
	to: Date | null
): DndColumn[] {
	if (!from || !to) {
		return [];
	}

	const daysCount = differenceInDays(to, from);
	const cols = [];

	for (let i = 0; i <= daysCount; i++) {
		const date = addDays(from, i);
		const dateString = format(date, "yyyy-MM-dd");
		cols.push({ id: dateString, title: `Day ${i + 1}` });
	}

	return cols;
}

export function getDateString(from: Date | null, date: Date | null): string {
	if (!from || !date) {
		return "";
	}

	const daysCount = Math.abs(differenceInDays(date, from));

	return `Day ${daysCount + 1}`;
}

export function getCards(
	places: PlaceModel[],
	isGallery?: boolean,
	from?: Date | null,
	to?: Date | null
): DndCard[] {
	const cards = places.map((place) => {
		if (place.date && from && to) {
			const adjustedTo = addDays(to, 1);
			const columnId =
				place.date >= from && place.date <= adjustedTo
					? format(place.date, "yyyy-MM-dd")
					: "";

			return {
				id: place.id,
				columnId,
				content: place
			};
		} else {
			return {
				id: place.id,
				columnId: "",
				content: place
			};
		}
	});

	if (isGallery) {
		return cards.sort((a, b) => b.content.sortOrder - a.content.sortOrder);
	}

	cards.sort((a, b) => {
		const dateA = a.content.date ? new Date(a.content.date) : null;
		const dateB = b.content.date ? new Date(b.content.date) : null;

		if (dateA === null && dateB === null) {
			// Both dates are null, sort by dateSortOrder in descending order
			const dateSortOrderA = a.content.dateSortOrder ?? Number.MIN_SAFE_INTEGER;
			const dateSortOrderB = b.content.dateSortOrder ?? Number.MIN_SAFE_INTEGER;
			return dateSortOrderB - dateSortOrderA;
		}

		if (dateA === null) return 1; // Treat null dates as the latest
		if (dateB === null) return -1; // Treat null dates as the latest

		if (dateA < dateB) return -1;
		if (dateA > dateB) return 1;

		// If dates are equal, sort by dateSortOrder in descending order
		const dateSortOrderA = a.content.dateSortOrder ?? Number.MIN_SAFE_INTEGER;
		const dateSortOrderB = b.content.dateSortOrder ?? Number.MIN_SAFE_INTEGER;
		return dateSortOrderB - dateSortOrderA;
	});

	return cards;
}

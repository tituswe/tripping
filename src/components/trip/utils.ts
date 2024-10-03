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

import { addDays, differenceInDays, format } from "date-fns";
import { DndColumn, DndDraggableData } from "./types";

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

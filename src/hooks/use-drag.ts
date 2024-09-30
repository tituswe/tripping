import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Trip, TripItem } from "@prisma/client";
import { differenceInDays, eachDayOfInterval, format } from "date-fns";
import { useEffect, useState } from "react";
import { Column, ColumnId, Item } from "../components/kanban-board/types";
import { hasDraggableData } from "../components/kanban-board/utils";

export const useDrag = (trip: Trip, tripItems: TripItem[]) => {
	const [activeColumn, setActiveColumn] = useState<Column | null>(null);

	const [activeItem, setActiveItem] = useState<Item | null>(null);

	const [items, setItems] = useState<Item[]>([]);

	const dateRange = eachDayOfInterval({
		start: new Date(trip.from),
		end: new Date(trip.to)
	}).map((date) => format(date, "yyyy-MM-dd"));

	const defaultCols = dateRange.map((date, index) => ({
		id: date,
		title: `Day ${differenceInDays(new Date(date), new Date(trip.from)) + 1}`
	})) satisfies Column[];

	const [columns, setColumns] = useState<Column[]>(defaultCols);

	const onDragStart = (event: DragStartEvent) => {
		if (!hasDraggableData(event.active)) return;

		const data = event.active.data.current;

		if (data?.type === "Column") {
			setActiveColumn(data.column);
			return;
		}

		if (data?.type === "Item") {
			setActiveItem(data.item);
			return;
		}
	};

	const onDragEnd = (event: DragEndEvent) => {
		setActiveColumn(null);
		setActiveItem(null);

		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		if (!hasDraggableData(active)) return;

		const activeData = active.data.current;

		if (activeId === overId) return;

		const isActiveAColumn = activeData?.type === "Column";
		if (!isActiveAColumn) return;

		setColumns((columns) => {
			const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

			const overColumnIndex = columns.findIndex((col) => col.id === overId);

			return arrayMove(columns, activeColumnIndex, overColumnIndex);
		});
	};

	const onDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		if (activeId === overId) return;

		if (!hasDraggableData(active) || !hasDraggableData(over)) return;

		const activeData = active.data.current;
		const overData = over.data.current;

		const isActiveAItem = activeData?.type === "Item";
		const isOverAItem = overData?.type === "Item";

		if (!isActiveAItem) return;

		// Im dropping a Item over another Item
		if (isActiveAItem && isOverAItem) {
			setItems((items) => {
				const activeIndex = items.findIndex((t) => t.id === activeId);
				const overIndex = items.findIndex((t) => t.id === overId);
				const activeItem = items[activeIndex];
				const overItem = items[overIndex];
				if (
					activeItem &&
					overItem &&
					activeItem.columnId !== overItem.columnId
				) {
					activeItem.columnId = overItem.columnId;
					return arrayMove(items, activeIndex, overIndex - 1);
				}

				return arrayMove(items, activeIndex, overIndex);
			});
		}

		const isOverAColumn = overData?.type === "Column";

		// Im dropping a Item over a column
		if (isActiveAItem && isOverAColumn) {
			setItems((items) => {
				const activeIndex = items.findIndex((t) => t.id === activeId);
				const activeItem = items[activeIndex];
				if (activeItem) {
					activeItem.columnId = overId as ColumnId;
					return arrayMove(items, activeIndex, activeIndex);
				}
				return items;
			});
		}
	};

	useEffect(() => {
		const initialItems = tripItems.map((item) =>
			item.from
				? {
						id: item.id,
						columnId: format(new Date(item.from!), "yyyy-MM-dd"),
						content: item
				  }
				: {
						id: item.id,
						columnId: "unbound",
						content: item
				  }
		);

		setItems(initialItems);
	}, [tripItems]);

	return {
		columns,
		activeColumn,
		items,
		activeItem,
		onDragStart,
		onDragEnd,
		onDragOver
	};
};

"use client";

import {
	closestCenter,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

type Item = {
	id: number;
	value: string;
};

const initialItems: Item[] = [
	{ id: 1, value: "Item 1" },
	{ id: 2, value: "Item 2" },
	{ id: 3, value: "Item 3" }
];

export function Playground() {
	const [items, setItems] = useState<Item[]>(initialItems);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				{items.map((item) => (
					<SortableItem key={item.id} item={item} />
				))}
			</SortableContext>
		</DndContext>
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (active.id !== over?.id) {
			setItems((items) => {
				const oldIndex = items.findIndex((i) => i.id === active.id);
				const newIndex = items.findIndex((i) => i.id === over?.id);

				return arrayMove(items, oldIndex, newIndex);
			});
		}
	}
}

interface SortableItemProps {
	item: Item;
}

export function SortableItem({ item }: SortableItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: item.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	return (
		<div ref={setNodeRef} style={style} className="flex items-center">
			<Button
				variant="ghost"
				className="px-1 cursor-grab"
				{...attributes}
				{...listeners}
			>
				<GripVertical className="w-4 h-4 text-muted-foreground" />
			</Button>
			<span className="border rounded p-3">{item.value}</span>
		</div>
	);
}

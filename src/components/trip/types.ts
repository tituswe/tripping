import { PlaceModel } from "@/lib/types";
import { UniqueIdentifier } from "@dnd-kit/core";

export const defaultCols = [
	{
		id: "todo" as const,
		title: "Todo"
	},
	{
		id: "in-progress" as const,
		title: "In progress"
	},
	{
		id: "done" as const,
		title: "Done"
	}
] satisfies DndColumn[];

export type DndColumnId = (typeof defaultCols)[number]["id"];

export type DndColumn = {
	id: UniqueIdentifier;
	title: string;
};

export type DndColumnType = "Column";

export type DndColumnDragData = {
	type: DndColumnType;
	column: DndColumn;
};

export type DndCard = {
	id: UniqueIdentifier;
	columnId: UniqueIdentifier;
	content: PlaceModel;
};

export type DndCardType = "Card";

export type DndCardDragData = {
	type: DndCardType;
	task: DndCard;
};

export type DndDraggableData = DndColumnDragData | DndCardDragData;

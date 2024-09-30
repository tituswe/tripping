import { UniqueIdentifier } from "@dnd-kit/core";
import { TripItem } from "@prisma/client";

export type Column = {
	id: UniqueIdentifier;
	title: string;
};

export type ColumnId = string;

export type ColumnType = "Column";

export type ColumnDragData = {
	type: ColumnType;
	column: Column;
};

export type Item = {
	id: UniqueIdentifier;
	columnId: ColumnId;
	content: TripItem;
};

export type ItemType = "Item";

export type ItemDragData = {
	type: ItemType;
	item: Item;
};

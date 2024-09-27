"use-client";

import { SortableContext } from "@dnd-kit/sortable";
import { BoardColumn, BoardContainer } from "./BoardColumn";
import { Column, Item } from "./types";

interface KanbanBoardProps {
  columns: Column[];
  items: Item[];
}

export function KanbanBoard({ columns, items }: KanbanBoardProps) {
  const columnsId = columns.map((col) => col.id);

  return (
    <BoardContainer>
      <SortableContext items={columnsId}>
        {columns.map((col) => (
          <BoardColumn
            key={col.id}
            column={col}
            items={items.filter((item) => item.columnId === col.id)}
          />
        ))}
      </SortableContext>
    </BoardContainer>
  );
}

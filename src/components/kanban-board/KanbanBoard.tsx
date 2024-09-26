"use-client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Trip, TripItem } from "@prisma/client";
import { differenceInDays, eachDayOfInterval, format } from "date-fns";
import { announcements } from "./accessibility";
import type { Column } from "./BoardColumn";
import { BoardColumn, BoardContainer } from "./BoardColumn";
import { type Item, ItemCard } from "./ItemCard";
import { coordinateGetter } from "./multipleContainersKeyboardPreset";
import { ColumnId } from "./types";
import { hasDraggableData } from "./utils";

interface KanbanBoardProps {
  trip: Trip;
  tripItems: TripItem[];
}

export function KanbanBoard({ trip, tripItems }: KanbanBoardProps) {
  const dateRange = eachDayOfInterval({
    start: new Date(trip.from),
    end: new Date(trip.to)
  }).map((date) => format(date, "yyyy-MM-dd"));

  const defaultCols = dateRange.map((date, index) => ({
    id: date,
    title: `Day ${differenceInDays(new Date(date), new Date(trip.from)) + 1}`
  })) satisfies Column[];

  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const pickedUpItemColumn = useRef<ColumnId | null>(null);
  const columnsId = columns.map((col) => col.id);

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const initialItems = tripItems
      .filter((item) => item.from)
      .map((item) => ({
        id: item.id,
        columnId: format(new Date(item.from!), "yyyy-MM-dd"),
        content: item
      }));

    setItems(initialItems);
  }, [tripItems]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeItem, setActiveItem] = useState<Item | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter
    })
  );

  return (
    <DndContext
      accessibility={{
        announcements: announcements(
          columnsId,
          columns,
          pickedUpItemColumn,
          items
        )
      }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
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

      {"document" in window &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                items={items.filter(
                  (item) => item.columnId === activeColumn.id
                )}
              />
            )}
            {activeItem && <ItemCard item={activeItem} isOverlay />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
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
  }

  function onDragEnd(event: DragEndEvent) {
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
  }

  function onDragOver(event: DragOverEvent) {
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
  }
}

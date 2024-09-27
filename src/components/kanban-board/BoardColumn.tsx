"use-client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useDndContext } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";
import { useMemo } from "react";
import { ItemCard } from "./ItemCard";
import { Column, ColumnDragData, Item } from "./types";

interface BoardColumnProps {
  column: Column;
  items: Item[];
  isOverlay?: boolean;
}

export function BoardColumn({ column, items, isOverlay }: BoardColumnProps) {
  const itemsIds = useMemo(() => {
    return items.map((item) => item.id);
  }, [items]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`
    }
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  const variants = cva(
    "h-[500px] max-h-[1000px] w-[280px] max-w-full flex flex-col flex-shrink-0 snap-center",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary"
        }
      }
    }
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border-none px-2",
        variants({
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined
        })
      )}
    >
      <CardHeader className="pb-2 pt-0 px-0 font-semibold border-b text-left flex flex-row space-between items-center">
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className=" p-1 text-primary/50 -ml-2 h-auto cursor-grab relative"
        >
          <span className="sr-only">{`Move column: ${column.title}`}</span>
          <GripVertical className="w-4 h-4" />
        </Button>
        <span className="ml-auto">{column.title}</span>
      </CardHeader>
      <ScrollArea>
        <CardContent className="flex flex-grow flex-col gap-2 py-3 px-0">
          <SortableContext items={itemsIds}>
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none"
      }
    }
  });

  return (
    <ScrollArea
      className={cn(
        variations({
          dragging: dndContext.active ? "active" : "default"
        })
      )}
    >
      <div className="flex gap-3 items-center flex-row justify-center">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

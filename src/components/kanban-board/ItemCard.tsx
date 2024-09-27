"use-client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn, currencyFormatter } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { Copy, GripVertical, MapPin } from "lucide-react";
import { Item, ItemDragData } from "./types";

interface ItemCardProps {
  item: Item;
  isOverlay?: boolean;
}

export function ItemCard({ item, isOverlay }: ItemCardProps) {
  const { toast } = useToast();

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: item.id,
    data: {
      type: "Item",
      item: item
    } satisfies ItemDragData,
    attributes: {
      roleDescription: "Item"
    }
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary"
      }
    }
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg",
        variants({
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined
        })
      )}
    >
      <CardHeader className="px-3 py-1.5 space-between flex flex-row border-b-2 border-secondary relative">
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
        >
          <span className="sr-only">Move item</span>
          <GripVertical className="w-4 h-4" />
        </Button>
        <Badge variant={"outline"} className="ml-auto font-semibold">
          {item.content.activity}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col p-3 text-left whitespace-pre-wrap">
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col justify-between">
            <span className="font-semibold">{item.content.name}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="text-start flex flex-row rounded-md space-x-0.5 pt-0.5">
                    <MapPin className="w-4 h-4 inline-block" />
                    <span
                      className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer transition hover:bg-secondary rounded-md py-1/2 px-1.5"
                      onClick={() => {
                        navigator.clipboard.writeText(item.content.address);
                        toast({
                          title: "Address copied!"
                        });
                      }}
                    >
                      {item.content.address}{" "}
                      <Copy className="w-3 h-3 inline-block ml-1" />
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex justify-between mt-3">
            <Badge variant="outline">
              {currencyFormatter.format(item.content.price)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

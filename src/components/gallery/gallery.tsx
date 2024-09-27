"use client";

import { SortableContext } from "@dnd-kit/sortable";
import { TripItem } from "@prisma/client";
import { format } from "date-fns";
import { GalleryCard } from "./gallery-card";

interface GalleryProps {
  data: TripItem[];
  tripTitle: string;
}

export function Gallery({ data, tripTitle }: GalleryProps) {
  const items = data
    .filter((item) => item.from)
    .map((item) => ({
      id: item.id,
      columnId: format(new Date(item.from!), "yyyy-MM-dd"),
      content: item
    }));

  console.log(items);

  const itemsIds = items.map((item) => item.id);

  return (
    <SortableContext items={itemsIds}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full py-4">
        {items.map((item) => (
          <GalleryCard key={item.id} item={item} />
        ))}
      </div>
    </SortableContext>
  );
}

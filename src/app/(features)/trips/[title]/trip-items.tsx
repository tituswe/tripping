"use client";

import { deleteTripItem } from "@/actions/actions";
import { DataTable } from "@/components/data-table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { TripItem } from "@prisma/client";
import { useEffect, useState } from "react";
import { getColumns } from "./columns";

interface TripItemsProps {
  tripTitle: string;
  data: TripItem[];
}

export function TripItems({ tripTitle, data }: TripItemsProps) {
  const [actionableTripItem, setActionableTripItem] = useState<TripItem | null>(
    null
  );

  const handleDelete = async () => {
    if (!actionableTripItem) return;

    await deleteTripItem(tripTitle, actionableTripItem.id).then(() => {
      setActionableTripItem(null);
    });
  };

  const columns = getColumns(setActionableTripItem, handleDelete);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Backspace") {
        handleDelete();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionableTripItem]);

  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold">Itinerary</h2>
        <DataTable columns={columns} data={data} tripTitle={tripTitle} />
      </CardContent>
    </Card>
  );
}

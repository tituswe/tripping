"use client";

import { deleteTripItems } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { TripItem } from "@prisma/client";
import { Table } from "@tanstack/react-table";

interface DataTableDeleteButtonProps {
  table: Table<TripItem>;
  tripTitle: string;
}

export function DataTableDeleteButton({
  table,
  tripTitle
}: DataTableDeleteButtonProps) {
  const selectedRows = table.getSelectedRowModel();

  const handleDelete = async () => {
    if (!selectedRows.rows.length) return;

    await deleteTripItems(
      tripTitle,
      selectedRows.rows.map((row) => row.original.id)
    );
  };

  if (selectedRows.rows.length <= 0) return null;

  return (
    <Button
      variant="destructive"
      size="sm"
      className="ml-auto hidden h-8 lg:flex"
      onClick={handleDelete}
    >
      <span className="mr-2">Delete</span>
      {selectedRows.rows.length}
    </Button>
  );
}

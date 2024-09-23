"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table";

import { EditTripItemSheet } from "@/app/(features)/trips/[title]/edit-trip-item-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { TripItem } from "@prisma/client";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { DataTableAddItemDialog } from "./data-table-add-item-dialog";
import { DataTableDeleteButton } from "./data-table-delete-button";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableRow } from "./data-table-row";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableProps<TValue> {
  columns: ColumnDef<TripItem, TValue>[];
  data: TripItem[];
  tripTitle: string;
  actionableTripItem: TripItem | null;
  setActionableTripItem: (item: TripItem | null) => void;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  handleEdit: () => void;
  handleDelete: () => void;
}

export function DataTable<TValue>({
  columns,
  data,
  tripTitle,
  actionableTripItem,
  setActionableTripItem,
  editing,
  setEditing,
  handleEdit,
  handleDelete
}: DataTableProps<TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    from: false,
    to: false,
    description: false
  });
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  });

  const isFiltered = table.getState().columnFilters.length > 0;
  const activities = Array.from(
    new Set(
      (data as TripItem[])
        .filter((item) => item.activity !== "")
        .map((item) => item.activity)
    )
  ).map((activity) => ({
    value: activity,
    label: activity
  }));

  return (
    <div>
      <div className="flex items-center py-4">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          {table.getColumn("activity") && (
            <DataTableFacetedFilter
              column={table.getColumn("activity")}
              title="Activity"
              options={activities}
            />
          )}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex flex-1 items-center space-x-2">
          <DataTableDeleteButton table={table} tripTitle={tripTitle} />
          <DataTableAddItemDialog
            activities={activities.map((activity) => activity.label)}
          />
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="rounded-md border mb-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.map((row) => (
                  <DataTableRow
                    key={row.id}
                    row={row}
                    setActionableTripItem={setActionableTripItem}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                  />
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      <EditTripItemSheet
        open={editing}
        onOpenChange={setEditing}
        tripTitle={tripTitle}
        activities={activities.map((activity) => activity.label)}
        actionableTripItem={actionableTripItem}
      />
    </div>
  );
}

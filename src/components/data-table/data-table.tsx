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

import { EditTripItemSheet } from "@/components/trip/edit-trip-item-sheet";
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
import { controlSymbol } from "@/lib/utils";
import { TripItem } from "@prisma/client";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { DataTableAddItemDialog } from "./data-table-add-item-dialog";
import { DataTableDeleteButton } from "./data-table-delete-button";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableRow } from "./data-table-row";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableProps {
  columns: ColumnDef<TripItem>[];
  data: TripItem[];
  tripTitle: string;
  actionableTripItem: TripItem | null;
  setActionableTripItem: (item: TripItem | null) => void;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  handleEdit: () => void;
  handleDelete: () => void;
}

export function DataTable({
  columns,
  data,
  tripTitle,
  actionableTripItem,
  setActionableTripItem,
  editing,
  setEditing,
  handleEdit,
  handleDelete
}: DataTableProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div>
      <div className="flex items-center py-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative">
            <Input
              ref={inputRef}
              placeholder="Find"
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <kbd className="absolute top-2 right-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">{controlSymbol()} </span>
              <span className="text-md">F</span>
            </kbd>
          </div>
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
            open={open}
            setOpen={setOpen}
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

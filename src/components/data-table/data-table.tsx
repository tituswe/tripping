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

import { Button } from "@/components/ui/button";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { TripItem } from "@prisma/client";
import { ContextMenu } from "@radix-ui/react-context-menu";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { CommandShortcut } from "../ui/command";
import { Separator } from "../ui/separator";
import { DataTableAddItemDialog } from "./data-table-add-item-dialog";
import { DataTableDeleteButton } from "./data-table-delete-button";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableProps<TValue> {
  columns: ColumnDef<TripItem, TValue>[];
  data: TripItem[];
  tripTitle: string;
  setActionableTripItem: (item: TripItem | null) => void;
  handleDelete: () => void;
}

export function DataTable<TValue>({
  columns,
  data,
  tripTitle,
  setActionableTripItem,
  handleDelete
}: DataTableProps<TValue>) {
  const { toast } = useToast();
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
    new Set((data as TripItem[]).map((item) => item.activity))
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
              table.getRowModel().rows.map((row) => (
                <ContextMenu
                  key={row.id}
                  onOpenChange={(open) =>
                    setActionableTripItem(open ? row.original : null)
                  }
                >
                  <ContextMenuTrigger asChild>
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="truncate overflow-hidden whitespace-nowrap"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem
                      className="cursor-pointer"
                      onClick={() => {}}
                    >
                      Edit
                    </ContextMenuItem>
                    <ContextMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(row.original.address);
                        toast({
                          title: "Address copied!"
                        });
                      }}
                    >
                      Copy address
                    </ContextMenuItem>
                    <Separator className="mt-1" />
                    <ContextMenuItem
                      className="cursor-pointer mt-1"
                      onClick={handleDelete}
                    >
                      Delete
                      <CommandShortcut>⌫</CommandShortcut>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
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
    </div>
  );
}

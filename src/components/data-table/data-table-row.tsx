"use client";

import { flexRender, Row } from "@tanstack/react-table";

import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { TripItem } from "@prisma/client";
import { ContextMenu } from "@radix-ui/react-context-menu";
import { CommandShortcut } from "../ui/command";
import { Separator } from "../ui/separator";

interface DataTableRowProps {
  row: Row<TripItem>;
  setActionableTripItem: (item: TripItem | null) => void;
  handleEdit: () => void;
  handleDelete: () => void;
}

export function DataTableRow({
  row,
  setActionableTripItem,
  handleEdit,
  handleDelete
}: DataTableRowProps) {
  const { toast } = useToast();

  return (
    <ContextMenu
      key={row.id}
      onOpenChange={(open) => setActionableTripItem(open ? row.original : null)}
    >
      <ContextMenuTrigger asChild>
        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
          {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              className="truncate overflow-hidden whitespace-nowrap"
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem className="cursor-pointer" onClick={handleEdit}>
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
        <ContextMenuItem className="cursor-pointer mt-1" onClick={handleDelete}>
          Delete
          <CommandShortcut>⌫</CommandShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

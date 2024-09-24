"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Column, ColumnDef, Row } from "@tanstack/react-table";

import { MoreHorizontal } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { CommandShortcut } from "@/components/ui/command";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { currencyFormatter } from "@/lib/utils";
import { TripItem } from "@prisma/client";
import { format } from "date-fns";

const sortableColumn = (title: string) => {
	const SortableColumnComponent = ({
		column
	}: {
		column: Column<TripItem, unknown>;
	}) => {
		return <DataTableColumnHeader column={column} title={title} />;
	};

	return SortableColumnComponent;
};

const dateRow = (property: keyof TripItem) => {
	const DateRowComponent = ({ row }: { row: Row<TripItem> }) => {
		const propertyValue = row.original[property];
		if (propertyValue === null || propertyValue === undefined) {
			return "";
		}
		const date = new Date(propertyValue as string | number | Date);
		return format(date, "d MMM, h:mm a");
	};

	return DateRowComponent;
};

const currencyRow = (property: keyof TripItem) => {
	const CurrencyRowComponent = ({ row }: { row: Row<TripItem> }) => {
		const price = parseFloat(row.getValue(property));
		const formatted = currencyFormatter.format(price);

		return formatted;
	};

	return CurrencyRowComponent;
};

const orFilter = (row: Row<TripItem>, id: string, value: any) => {
	return value.includes(row.getValue(id));
};

export const getColumns = (
	setActionableTripItem: (item: TripItem | null) => void,
	handleEdit: () => void,
	handleDelete: () => void,
	toast: any
): ColumnDef<TripItem>[] => [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: "name",
		header: sortableColumn("Name")
	},
	{
		accessorKey: "address",
		header: sortableColumn("Address")
	},
	{
		accessorKey: "activity",
		header: sortableColumn("Activity"),
		filterFn: orFilter
	},
	{
		accessorKey: "from",
		header: sortableColumn("From"),
		cell: dateRow("from")
	},
	{
		accessorKey: "to",
		header: sortableColumn("To"),
		cell: dateRow("to")
	},
	{
		accessorKey: "description",
		header: sortableColumn("Description")
	},
	{
		accessorKey: "price",
		header: sortableColumn("Price"),
		cell: currencyRow("price")
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const tripItem = row.original;

			return (
				<div className="flex justify-end">
					<DropdownMenu
						onOpenChange={(open) =>
							setActionableTripItem(open ? tripItem : null)
						}
					>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem className="cursor-pointer" onClick={handleEdit}>
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={() => {
									navigator.clipboard.writeText(tripItem.address);
									toast({
										title: "Address copied!"
									});
								}}
							>
								Copy address
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={handleDelete}
							>
								Delete
								<CommandShortcut>⌫</CommandShortcut>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false
	}
];

"use client";

import { createPortal } from "react-dom";

import { deleteTripItem } from "@/actions/actions";
import { getColumns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { Gallery } from "@/components/gallery/gallery";
import { BoardColumn } from "@/components/kanban-board/BoardColumn";
import { ItemCard } from "@/components/kanban-board/ItemCard";
import { coordinateGetter } from "@/components/kanban-board/multipleContainersKeyboardPreset";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useToast } from "@/hooks/use-toast";
import {
	DndContext,
	DragOverlay,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors
} from "@dnd-kit/core";
import { Trip, TripItem } from "@prisma/client";
import { Map } from "lucide-react";
import { useState } from "react";
import { useDrag } from "../../hooks/use-drag";
import { KanbanBoard } from "../kanban-board/KanbanBoard";
import { TripTabs } from "./trip-tabs";

interface TripItemsProps {
	tripTitle: string;
	trip: Trip;
	tripItems: TripItem[];
}

export function TripItems({ tripTitle, trip, tripItems }: TripItemsProps) {
	const { toast } = useToast();

	const [editing, setEditing] = useState(false);
	const [tab, setTab] = useState("gallery");
	const [actionableTripItem, setActionableTripItem] = useState<TripItem | null>(
		null
	);

	const handleEdit = () => {
		setEditing(!editing);
	};

	const handleDelete = async () => {
		if (!actionableTripItem) return;

		await deleteTripItem(tripTitle, actionableTripItem.id).then(() => {
			setActionableTripItem(null);
		});
	};

	const tableColumns = getColumns(
		setActionableTripItem,
		handleEdit,
		handleDelete,
		toast
	);

	const {
		columns,
		activeColumn,
		items,
		activeItem,
		onDragStart,
		onDragEnd,
		onDragOver
	} = useDrag(trip, tripItems);

	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: coordinateGetter
		})
	);

	useKeyboardShortcuts(actionableTripItem, handleDelete, setTab);

	return (
		<Card className="rounded-lg border-none mt-6">
			<CardContent className="p-6 space-y-6">
				<h2 className="text-2xl font-semibold">Itinerary</h2>
				<DndContext
					sensors={sensors}
					onDragStart={onDragStart}
					onDragEnd={onDragEnd}
					onDragOver={onDragOver}
				>
					<KanbanBoard columns={columns} items={items} />
					<Separator />
					<TripTabs tab={tab} setTab={setTab}>
						<TabsContent value="gallery">
							<Gallery data={items} />
						</TabsContent>
						<TabsContent value="table">
							<DataTable
								columns={tableColumns}
								data={tripItems}
								tripTitle={tripTitle}
								actionableTripItem={actionableTripItem}
								setActionableTripItem={setActionableTripItem}
								editing={editing}
								setEditing={setEditing}
								handleEdit={handleEdit}
								handleDelete={handleDelete}
							/>
						</TabsContent>
						<TabsContent value="map">
							<Map />
						</TabsContent>
					</TripTabs>

					{"document" in window &&
						createPortal(
							<DragOverlay>
								{activeColumn && (
									<BoardColumn
										isOverlay
										column={activeColumn}
										items={items.filter(
											(item) => item.columnId === activeColumn.id
										)}
									/>
								)}
								{activeItem && <ItemCard item={activeItem} isOverlay />}
							</DragOverlay>,
							document.body
						)}
				</DndContext>
			</CardContent>
		</Card>
	);
}

"use client";

import { deleteTripItem } from "@/actions/actions";
import { DataTable } from "@/components/data-table/data-table";
import { Gallery } from "@/components/gallery/gallery";
import { Card, CardContent } from "@/components/ui/card";
import { CommandShortcut } from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { TripItem } from "@prisma/client";
import { Images, Map, Table } from "lucide-react";
import { useEffect, useState } from "react";
import { getColumns } from "./columns";

interface TripItemsProps {
	tripTitle: string;
	data: TripItem[];
}

export function TripItems({ tripTitle, data }: TripItemsProps) {
	const { toast } = useToast();

	const [actionableTripItem, setActionableTripItem] = useState<TripItem | null>(
		null
	);
	const [editing, setEditing] = useState(false);
	const [tab, setTab] = useState("table");

	const handleEdit = () => {
		setEditing(!editing);
	};

	const handleDelete = async () => {
		if (!actionableTripItem) return;

		await deleteTripItem(tripTitle, actionableTripItem.id).then(() => {
			setActionableTripItem(null);
		});
	};

	const columns = getColumns(
		setActionableTripItem,
		handleEdit,
		handleDelete,
		toast
	);

	useEffect(() => {
		if (!actionableTripItem) return;

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

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "1" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setTab("table");
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "2" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setTab("gallery");
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "3" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setTab("map");
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<>
			<Tabs value={tab} onValueChange={setTab}>
				<TabsList>
					<TabsTrigger value="table">
						<Table className="h-4 w-4 mr-2" />
						<span className="mr-2">Table</span>
						<CommandShortcut>
							<span className="text-xs">⌘</span>
							<span className="text-md">1</span>
						</CommandShortcut>
					</TabsTrigger>
					<TabsTrigger value="gallery">
						<Images className="h-4 w-4 mr-2" />
						<span className="mr-2">Gallery</span>
						<CommandShortcut>
							<span className="text-xs">⌘</span>
							<span className="text-md">2</span>
						</CommandShortcut>
					</TabsTrigger>
					<TabsTrigger value="map">
						<Map className="h-4 w-4 mr-2" />
						<span className="mr-2">Map</span>
						<CommandShortcut>
							<span className="text-xs">⌘</span>
							<span className="text-md">3</span>
						</CommandShortcut>
					</TabsTrigger>
				</TabsList>
				<Card className="rounded-lg border-none mt-6">
					<CardContent className="p-6">
						<h2 className="text-2xl font-semibold">Itinerary</h2>
						<TabsContent value="table">
							<DataTable
								columns={columns}
								data={data}
								tripTitle={tripTitle}
								actionableTripItem={actionableTripItem}
								setActionableTripItem={setActionableTripItem}
								editing={editing}
								setEditing={setEditing}
								handleEdit={handleEdit}
								handleDelete={handleDelete}
							/>
						</TabsContent>
						<TabsContent value="gallery">
							<Gallery data={data} tripTitle={tripTitle} />
						</TabsContent>
						<TabsContent value="map">
							<Map />
						</TabsContent>
					</CardContent>
				</Card>
			</Tabs>
		</>
	);
}

"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScreenResize, useScreenSize } from "@/hooks/use-screen-size";
import { useStore } from "@/hooks/use-store";
import { useTabToggle } from "@/hooks/use-tab-toggle";
import { PlaceModel, TripModel } from "@/lib/types";
import { TabsContent } from "@radix-ui/react-tabs";
import { APIProvider } from "@vis.gl/react-google-maps";
import { GalleryThumbnails, Kanban } from "lucide-react";
import { useEffect, useState } from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup
} from "../ui/resizable";
import { TripGallery } from "./trip-gallery";
import { TripItinerary } from "./trip-itinerary";
import { TripMap } from "./trip-map";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const libraries = ["marker"];

interface TripContentProps {
	trip: TripModel;
}

export function TripContent({ trip }: TripContentProps) {
	const tab = useStore(useTabToggle, (state) => state);

	const [hoverId, setHoverId] = useState<string | null>(null);

	const [selectedPlace, setSelectedPlace] = useState<PlaceModel | null>(null);

	useEffect(() => {
		setSelectedPlace(
			trip.places.find((place) => place.id === selectedPlace?.id) || null
		);
	}, [trip.places]);

	const screen = useScreenSize();

	useScreenResize();

	return (
		<APIProvider apiKey={API_KEY} libraries={libraries}>
			{screen.screenSize === "sm" && (
				<div className="space-y-3">
					<Tabs
						value={tab?.tab}
						onValueChange={tab?.setTab}
						className="space-y-3 bg-background p-0"
					>
						<TabsList className="m-2 mb-0">
							<TabsTrigger value="gallery">
								<GalleryThumbnails className="h-4 w-4 mr-2" />
								<span className="mr-2">Gallery Grid</span>
							</TabsTrigger>
							<TabsTrigger value="kanban">
								<Kanban className="h-4 w-4 mr-2" />
								<span className="mr-2">Kanban Board</span>
							</TabsTrigger>
						</TabsList>
						<TabsContent value="gallery">
							<TripGallery
								trip={trip}
								hoverId={hoverId}
								setHoverId={setHoverId}
								selectedPlace={selectedPlace}
								setSelectedPlace={setSelectedPlace}
							/>
						</TabsContent>
						<TabsContent value="kanban">
							<TripItinerary
								trip={trip}
								hoverId={hoverId}
								setHoverId={setHoverId}
								selectedPlace={selectedPlace}
								setSelectedPlace={setSelectedPlace}
							/>
						</TabsContent>
						<TripMap
							trip={trip}
							hoverId={hoverId}
							setHoverId={setHoverId}
							selectedPlace={selectedPlace}
							setSelectedPlace={setSelectedPlace}
						/>
					</Tabs>
				</div>
			)}
			{screen.screenSize !== "sm" && (
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel defaultSize={59} minSize={50}>
						<Tabs
							value={tab?.tab}
							onValueChange={tab?.setTab}
							className="space-y-3 bg-background p-3"
						>
							<TabsList className="m-2 mb-0">
								<TabsTrigger value="gallery">
									<GalleryThumbnails className="h-4 w-4 mr-2" />
									<span className="mr-2">Gallery Grid</span>
								</TabsTrigger>
								<TabsTrigger value="kanban">
									<Kanban className="h-4 w-4 mr-2" />
									<span className="mr-2">Kanban Board</span>
								</TabsTrigger>
							</TabsList>
							<TabsContent value="gallery">
								<TripGallery
									trip={trip}
									hoverId={hoverId}
									setHoverId={setHoverId}
									selectedPlace={selectedPlace}
									setSelectedPlace={setSelectedPlace}
								/>
							</TabsContent>
							<TabsContent value="kanban">
								<TripItinerary
									trip={trip}
									hoverId={hoverId}
									setHoverId={setHoverId}
									selectedPlace={selectedPlace}
									setSelectedPlace={setSelectedPlace}
								/>
							</TabsContent>
						</Tabs>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel className="relative">
						<TripMap
							trip={trip}
							hoverId={hoverId}
							setHoverId={setHoverId}
							selectedPlace={selectedPlace}
							setSelectedPlace={setSelectedPlace}
						/>
					</ResizablePanel>
				</ResizablePanelGroup>
			)}
		</APIProvider>
	);
}

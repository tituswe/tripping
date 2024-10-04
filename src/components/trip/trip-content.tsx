"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/hooks/use-store";
import { useTabToggle } from "@/hooks/use-tab-toggle";
import { TripModel } from "@/lib/types";
import { TabsContent } from "@radix-ui/react-tabs";
import { APIProvider } from "@vis.gl/react-google-maps";
import { GalleryThumbnails, Kanban } from "lucide-react";
import { Playground } from "../playground";
import { TripGallery } from "./trip-gallery";
import { TripItinerary } from "./trip-itinerary";
import { TripMap } from "./trip-map";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

interface TripContentProps {
	trip: TripModel;
}

export function TripContent({ trip }: TripContentProps) {
	const tab = useStore(useTabToggle, (state) => state);

	return (
		<APIProvider apiKey={API_KEY}>
			<div className="flex flex-col gap-3 md:m-3">
				<Card className="rounded-lg border-none min-w-[320px]">
					<CardContent className="p-3 pt-6 md:p-6">
						<Tabs
							value={tab?.tab}
							onValueChange={tab?.setTab}
							className="space-y-3 md:space-y-6"
						>
							<TabsList>
								<TabsTrigger value="gallery">
									<GalleryThumbnails className="h-4 w-4 mr-2" />
									<span className="mr-2">Gallery View</span>
								</TabsTrigger>
								<TabsTrigger value="map">
									<Kanban className="h-4 w-4 mr-2" />
									<span className="mr-2">Kanban Board</span>
								</TabsTrigger>
							</TabsList>
							<TabsContent value="gallery">
								<TripGallery trip={trip} />
							</TabsContent>
							<TabsContent value="map">
								<TripItinerary trip={trip} />
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
				<Card className="rounded-lg border-none min-w-[320px]">
					<CardContent className="p-6 space-y-6">
						<TripMap />
					</CardContent>
				</Card>
				<Card className="rounded-lg border-none min-w-[320px]">
					<CardContent className="p-6 space-y-6">
						<Playground />
					</CardContent>
				</Card>
			</div>
		</APIProvider>
	);
}

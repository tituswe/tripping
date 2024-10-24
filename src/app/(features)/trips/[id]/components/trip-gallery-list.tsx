"use client";

import { TripModel } from "@/lib/types";

interface TripGalleryListProps {
	trip: TripModel;
	selectedDay: number;
}

export function TripGalleryList({ trip, selectedDay }: TripGalleryListProps) {
	return <div className="h-screen text-center pt-12">Gallery List</div>;
}

"use client";

import { TripModel } from "@/lib/types";

interface TripKanbanBoardProps {
	trip: TripModel;
}

export function TripKanbanBoard({ trip }: TripKanbanBoardProps) {
	return <div className="flex-grow text-center pt-12">Kanban Board</div>;
}

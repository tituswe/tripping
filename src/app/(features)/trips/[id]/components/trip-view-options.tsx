"use client";

import { Button } from "@/components/ui/button";
import { Kanban, List } from "lucide-react";
import { ViewType } from "../types";

interface TripViewOptionsProps {
	view: ViewType;
	setView: (view: ViewType) => void;
}

export function TripViewOptions({ view, setView }: TripViewOptionsProps) {
	return (
		<div className="absolute top-3 left-3 flex space-x-3">
			<Button variant="outline" size="sm" onClick={() => setView("gallery")}>
				<List className="w-4 h-4 mr-2" />
				<p className="text-xs">Gallery List</p>
			</Button>
			<Button variant="outline" size="sm" onClick={() => setView("kanban")}>
				<Kanban className="w-4 h-4 mr-2" />
				<p className="text-xs">Kanban Board</p>
			</Button>
		</div>
	);
}

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
		<div className="absolute top-5 left-5 sm:top-3 sm:left-3 flex space-x-3">
			<div className="hidden sm:flex space-x-3">
				<Button variant="outline" size="sm" onClick={() => setView("gallery")}>
					<List className="w-4 h-4 mr-2" />
					<p className="text-xs">Gallery List</p>
				</Button>
				<Button variant="outline" size="sm" onClick={() => setView("kanban")}>
					<Kanban className="w-4 h-4 mr-2" />
					<p className="text-xs">Kanban Board</p>
				</Button>
			</div>
			<div className="sm:hidden translate-x-10 flex space-x-3">
				<Button
					variant="outline"
					size="icon"
					onClick={() => {
						setView(null);
						setTimeout(() => setView("gallery"), 700);
					}}
				>
					<List className="w-4 h-4" />
				</Button>
				<Button
					variant="outline"
					size="icon"
					onClick={() => {
						setView(null);
						setTimeout(() => setView("kanban"), 700);
					}}
				>
					<Kanban className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}

"use client";

import { updateTrip } from "@/actions/actions";
import { TripModel } from "@/lib/types";
import { useState } from "react";

interface TripTitleProps {
	trip: TripModel;
}

export function TripTitle({ trip }: TripTitleProps) {
	const [title, setTitle] = useState(trip.location.name);
	const [isEditingTitle, setIsEditingTitle] = useState(false);

	const handleTitleClick = () => {
		setIsEditingTitle(true);
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const handleTitleBlur = async () => {
		setIsEditingTitle(false);
		await updateTrip(trip.id, { title });
	};

	return isEditingTitle ? (
		<input
			type="text"
			value={title || ""}
			onChange={handleTitleChange}
			onBlur={handleTitleBlur}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					e.currentTarget.blur();
				}
			}}
			className="font-medium text-lg w-full truncate mr-3 focus:outline-muted"
			autoFocus
		/>
	) : (
		<h2
			className="font-medium text-lg truncate mr-3"
			onClick={handleTitleClick}
		>
			{trip.title || `Your trip to ${trip.location.name}`}
		</h2>
	);
}

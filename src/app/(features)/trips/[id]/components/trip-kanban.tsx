"use client";

import { createPlace } from "@/actions/actions";
import { TripModel, UserModel } from "@/lib/types";
import { PlaceReview } from "@prisma/client";
import { ChevronDown, ChevronLeft, List } from "lucide-react";
import { ViewType } from "../types";
import { TripDates } from "./trip-dates";
import { TripKanbanBoard } from "./trip-kanban-board";
import { TripParty } from "./trip-party";
import { TripSearch } from "./trip-search";
import { TripSettings } from "./trip-settings";
import { TripTitle } from "./trip-title";
import { TripViewOptionIconButton } from "./trip-view-option-icon-button";

interface TripKanbanProps {
	users: UserModel[];
	trip: TripModel;
	view: ViewType;
	setView: (view: ViewType) => void;
}

export function TripKanban({ users, trip, view, setView }: TripKanbanProps) {
	return (
		<div
			className={`absolute bottom-0 sm:top-0 left-0 z-20 bg-background h-screen sm:w-5/6 w-full xs:transition-transform duration-700 ${
				view === "kanban"
					? "translate-y-0 sm:translate-x-0"
					: "translate-y-full sm:translate-y-0 sm:-translate-x-full"
			}
			${
				view === "kanban"
					? "sm:h-screen h-[calc(100vh_-_160px)] rounded-t-xl sm:rounded-t-none"
					: "h-0 sm:h-auto"
			}`}
		>
			{view === "kanban" && (
				<div className="py-5 flex flex-col space-y-1.5">
					<div className="mx-5 flex items-center overflow-hidden max-w-full">
						<TripTitle trip={trip} />
						<div className="ml-auto space-x-2 flex-shrink-0">
							<TripViewOptionIconButton
								icon={List}
								tooltip="Gallery List"
								callBack={() => {
									setView(null);
									setTimeout(() => setView("gallery"), 700);
								}}
							/>
							<TripViewOptionIconButton
								icon={ChevronLeft}
								smIcon={ChevronDown}
								tooltip="Close"
								callBack={() => setView(null)}
							/>
						</div>
					</div>
					<div className="h-1" />
					<div className="mx-5">
						<TripSearch
							existingPlaces={trip.places}
							onPlaceSelect={onPlaceSelect}
						/>
					</div>
					<div className="flex justify-between items-center px-5">
						<TripDates trip={trip} />
						<div className="flex flex-row items-center space-x-1.5">
							<TripParty users={users} trip={trip} />
							<TripSettings trip={trip} />
						</div>
					</div>
					<TripKanbanBoard trip={trip} />
				</div>
			)}
		</div>
	);

	async function onPlaceSelect(place: google.maps.places.PlaceResult | null) {
		if (!place) return;

		if (!place.place_id) return;

		const country =
			place.address_components?.find((comp) => comp.types.includes("country"))
				?.long_name || null;
		const city =
			place.address_components?.find((comp) =>
				comp.types.includes("administrative_area_level_1")
			)?.long_name || null;
		const district =
			place.address_components?.find((comp) => comp.types.includes("locality"))
				?.long_name || null;

		const photos = place.photos?.map((photo) => photo.getUrl()) || [];

		const reviews =
			place.reviews?.map(
				(review) =>
					({
						authorName: review.author_name,
						authorUrl: review.author_url,
						language: review.language,
						profilePhotoUrl: review.profile_photo_url,
						rating: review.rating,
						relativeTimeDescription: review.relative_time_description,
						text: review.text,
						postedAt: new Date(review.time)
					} as PlaceReview)
			) || [];

		const newPlace = {
			placeId: place.place_id,
			tripId: trip.id,
			name: place.name || null,
			date: null,
			dateSortOrder: null,
			formattedAddress: place.formatted_address || null,
			country,
			city,
			district,
			lat: place.geometry?.location?.lat() || null,
			lng: place.geometry?.location?.lng() || null,
			tags: place.types || [],
			photos,
			openingHours: place.opening_hours?.weekday_text || [],
			rating: place.rating || null,
			userRatingsTotal: place.user_ratings_total || null,
			reviews
		};

		await createPlace(trip.id, newPlace);
	}
}

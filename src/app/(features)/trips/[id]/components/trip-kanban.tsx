"use client";

import { createPlace } from "@/actions/actions";
import { PlaceModel, TripModel } from "@/lib/types";
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
	trip: TripModel;
	view: ViewType;
	setView: (view: ViewType) => void;
	selectedPlace: PlaceModel | null;
	setSelectedPlace: (place: PlaceModel | null) => void;
	selectedDate: Date | null;
	setSelectedDate: (date: Date | null) => void;
}

export function TripKanban({
	trip,
	view,
	setView,
	selectedPlace,
	setSelectedPlace,
	selectedDate,
	setSelectedDate
}: TripKanbanProps) {
	return (
		<div
			className={`absolute bottom-0 sm:top-0 left-0 z-20 bg-background h-0 sm:h-screen sm:w-5/6 w-full xs:transition-transform ease-in-out duration-700 rounded-t-xl sm:rounded-t-none ${
				view === "kanban"
					? "translate-y-0 sm:translate-x-0 sm:h-screen h-[calc(100vh-160px)] sm:rounded-t-none"
					: "translate-y-full sm:translate-y-0 sm:-translate-x-full h-0 sm:h-auto"
			}`}
		>
			{view === "kanban" && (
				<div className="h-full pt-5 flex flex-col space-y-1.5">
					<div className="mx-5 flex items-center overflow-hidden max-w-full flex-shrink-0">
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
							disabled={trip.from === null || trip.to === null}
							existingPlaces={trip.places}
							onPlaceSelect={onPlaceSelect}
						/>
					</div>
					<div className="flex justify-between items-center px-5 bg-background  duration-700 ease-in-out">
						<TripDates trip={trip} />
						<div className="flex flex-row items-center space-x-1.5">
							<TripParty trip={trip} />
							<TripSettings trip={trip} />
						</div>
					</div>
					<TripKanbanBoard
						trip={trip}
						selectedPlace={selectedPlace}
						setSelectedPlace={setSelectedPlace}
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
					/>
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
			date: selectedDate,
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

"use client";

import { createPlace } from "@/actions/actions";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TripModel, UserModel } from "@/lib/types";
import { PlaceReview } from "@prisma/client";
import { ChevronDown, ChevronLeft, Kanban } from "lucide-react";
import { useState } from "react";
import { ViewType } from "../types";
import { TripDates } from "./trip-dates";
import { TripGalleryList } from "./trip-gallery-list";
import { TripParty } from "./trip-party";
import { TripSearch } from "./trip-search";
import { TripSettings } from "./trip-settings";
import { TripTitle } from "./trip-title";
import { TripViewOptionIconButton } from "./trip-view-option-icon-button";

interface TripGalleryProps {
	users: UserModel[];
	trip: TripModel;
	view: ViewType;
	setView: (view: ViewType) => void;
}

export function TripGallery({ users, trip, view, setView }: TripGalleryProps) {
	const [selectedDate, setSelectedDate] = useState<Date | null>(trip.from);

	return (
		<div
			className={`absolute bottom-0 sm:top-0 left-0 z-20 bg-background h-0 sm:h-screen sm:w-[388px] w-full xs:transition-transform ease-in-out duration-700 rounded-t-xl sm:rounded-t-none overflow-hidden ${
				view === "gallery"
					? "translate-y-0 sm:translate-x-0 sm:h-screen h-[calc(100vh-160px)] sm:rounded-t-none"
					: "translate-y-full sm:translate-y-0 sm:-translate-x-full h-0 sm:h-auto"
			}`}
		>
			{view === "gallery" && (
				<div className="h-full pt-5 flex flex-col space-y-1.5">
					<div className="mx-5 flex items-center overflow-hidden max-w-full">
						<TripTitle trip={trip} />
						<div className="ml-auto space-x-2 flex-shrink-0">
							<TripViewOptionIconButton
								icon={Kanban}
								tooltip="Kanban Board"
								callBack={() => {
									setView(null);
									setTimeout(() => setView("kanban"), 500);
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
					<div>
						<ScrollArea className="h-[calc(100vh_-_318px)] sm:h-[calc(100vh_-_318px_+_160px)]">
							<div>
								<div className="flex justify-between items-center px-5 bg-background  duration-700 ease-in-out">
									<TripDates trip={trip} />
									<div className="flex flex-row items-center space-x-1.5">
										<TripParty users={users} trip={trip} />
										<TripSettings trip={trip} />
									</div>
								</div>
								<TripGalleryList
									trip={trip}
									selectedDate={selectedDate}
									setSelectedDate={setSelectedDate}
								/>
							</div>
							<ScrollBar className="z-30" />
						</ScrollArea>
						<div className="py-3">{/* Footer Widgets */}</div>
					</div>
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

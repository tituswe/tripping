"use client";

import { createPlace } from "@/actions/actions";
import { GooglePhoto } from "@/components/admin-panel/google-photo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlaceModel, TripModel } from "@/lib/types";
import { snakeToNormalCase } from "@/lib/utils";
import { PlaceReview } from "@prisma/client";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { ChevronDown, ChevronLeft, Copy, Kanban, X } from "lucide-react";
import { ViewType } from "../types";
import { TripDates } from "./trip-dates";
import { TripGalleryList } from "./trip-gallery-list";
import { TripParty } from "./trip-party";
import { TripReviewCard } from "./trip-review-card";
import { TripSearch } from "./trip-search";
import { TripSettings } from "./trip-settings";
import { TripTitle } from "./trip-title";
import { TripViewOptionIconButton } from "./trip-view-option-icon-button";

interface TripGalleryProps {
	trip: TripModel;
	view: ViewType;
	setView: (view: ViewType) => void;
	selectedPlace: PlaceModel | null;
	setSelectedPlace: (place: PlaceModel | null) => void;
	selectedDate: Date | null;
	setSelectedDate: (date: Date | null) => void;
}

export function TripGallery({
	trip,
	view,
	setView,
	selectedPlace,
	setSelectedPlace,
	selectedDate,
	setSelectedDate
}: TripGalleryProps) {
	return (
		<>
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
								disabled={trip.from === null || trip.to === null}
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
											<TripParty trip={trip} />
											<TripSettings trip={trip} />
										</div>
									</div>
									<TripGalleryList
										trip={trip}
										selectedPlace={selectedPlace}
										setSelectedPlace={setSelectedPlace}
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

			{/* SELECTED PLACE POPUP */}
			{selectedPlace && (
				<div
					className={`absolute hidden lg:block top-0 left-[388px] z-20 h-0 sm:h-screen sm:w-[452px] p-6 rounded-lg ${
						view === "gallery" ? "opacity-100" : "opacity-0"
					} transition-opacity ease-in-out`}
				>
					<Card className="h-full relative rounded-lg">
						<Button
							className="absolute top-3 z-30 right-3"
							size={"icon"}
							variant={"secondary"}
							onClick={() => setSelectedPlace(null)}
						>
							<X className="w-5 h-5 text-muted-foreground" />
						</Button>

						<ScrollArea className="h-full">
							<GooglePhoto
								placeId={selectedPlace?.placeId}
								width={404}
								className="w-[404px] h-48 object-cover rounded-lg"
							/>
							<div>
								<p className="text-center text-lg font-medium mt-3">
									{selectedPlace.name}
								</p>
								<div className="flex justify-center mt-3">
									<Separator className="w-11/12" />
								</div>
								<div className="mt-3 mx-5 space-y-1.5">
									<p className="text-xs font-medium text-muted-foreground">
										{selectedPlace.country && `${selectedPlace.country} `}
									</p>
									<p className="text-xs font-medium text-muted-foreground">
										{selectedPlace.district && `${selectedPlace.district} `}
									</p>
									<p className="text-xs font-medium text-muted-foreground">
										{selectedPlace.city && `${selectedPlace.city} `}
									</p>
								</div>
								<div
									className="flex mx-3 px-2 mt-1 py-1 cursor-pointer hover:bg-muted transition rounded-md"
									onClick={() => {
										navigator.clipboard.writeText(
											selectedPlace.formattedAddress || ""
										);
									}}
								>
									<p className="text-xs text-muted-foreground">
										{selectedPlace.formattedAddress}
									</p>
									<Copy className="ml-auto w-4 h-4 inline-block text-muted-foreground" />
								</div>
								<div className="mx-5 mt-1.5">
									{selectedPlace.tags.map((tag, index) => (
										<Badge key={index} variant={"secondary"} className="mr-1.5">
											{snakeToNormalCase(tag)}
										</Badge>
									))}
								</div>
								<div className="flex flex-row items-center mx-5 mt-7">
									<StarFilledIcon className="w-5 h-5 text-yellow-400" />
									<p className="ml-2">{selectedPlace.rating || "No rating"}</p>
									<p className="text-muted-foreground ml-1.5">
										({selectedPlace.userRatingsTotal || "0"} Ratings)
									</p>
								</div>
								<div className="px-5 mt-3">
									{selectedPlace.reviews.map((review, index) => (
										<TripReviewCard key={index} review={review} />
									))}
								</div>
							</div>
						</ScrollArea>
					</Card>
				</div>
			)}
		</>
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

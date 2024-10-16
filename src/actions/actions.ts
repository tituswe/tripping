"use server";

import { DateRange } from "react-day-picker";

import prisma from "@/lib/db";
import {
	LocationRequest,
	PlaceModel,
	PlaceRequest,
	TripModel
} from "@/lib/types";
import { Place, Trip } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createTrip(
	location: LocationRequest,
	dateRange?: DateRange
): Promise<TripModel> {
	let existingLocation = await prisma.location.findFirst({
		where: { placeId: location.placeId }
	});

	if (!existingLocation) {
		existingLocation = await prisma.location.create({
			data: {
				placeId: location.placeId,
				name: location.name,
				formattedAddress: location.formattedAddress,
				country: location.country,
				city: location.city,
				district: location.district,
				lat: location.lat,
				lng: location.lng,
				locationType: location.locationType
			}
		});
	}

	const newTrip = await prisma.trip.create({
		data: {
			locationId: existingLocation.id,
			from: dateRange?.from,
			to: dateRange?.to
		},
		include: {
			location: true,
			places: {
				include: { reviews: true }
			}
		}
	});

	const newTripModel = {
		...newTrip,
		location: { ...newTrip.location, photos: [] },
		places: newTrip.places.map((place) => ({ ...place, photos: [] }))
	};

	revalidatePath(`/trips`);

	return newTripModel;
}

export async function getTrip(id: string): Promise<TripModel> {
	const trip = await prisma.trip.findFirstOrThrow({
		where: { id },
		include: {
			location: true,
			places: {
				include: { reviews: true }
			}
		}
	});

	const tripModel = {
		...trip,
		location: { ...trip.location, photos: [] },
		places: trip.places.map((place) => ({ ...place, photos: [] }))
	};

	return tripModel;
}

export async function getTrips(): Promise<TripModel[]> {
	const trips = await prisma.trip.findMany({
		include: {
			location: true,
			places: {
				include: { reviews: true }
			}
		}
	});

	const tripModels = trips.map((trip) => ({
		...trip,
		location: { ...trip.location, photos: [] },
		places: trip.places.map((place) => ({ ...place, photos: [] }))
	}));

	return tripModels;
}

export async function updateTrip(
	id: string,
	updates: Partial<Trip>
): Promise<TripModel> {
	const updatedTrip = await prisma.trip.update({
		where: { id },
		data: updates,
		include: {
			location: true,
			places: {
				include: { reviews: true }
			}
		}
	});

	const updatedTripModel = {
		...updatedTrip,
		location: { ...updatedTrip.location, photos: [] },
		places: updatedTrip.places.map((place) => ({ ...place, photos: [] }))
	};

	revalidatePath(`/trips`);

	return updatedTripModel;
}

export async function deleteTrip(id: string): Promise<void> {
	await prisma.trip.delete({
		where: { id }
	});

	revalidatePath(`/trips`);
}

export async function createPlace(
	tripId: string,
	place: PlaceRequest
): Promise<Place> {
	const maxOrderPlace = await prisma.place.aggregate({
		_max: {
			sortOrder: true
		},
		where: {
			tripId
		}
	});

	const maxOrder = maxOrderPlace._max?.sortOrder || 0;

	const newPlace = await prisma.place.create({
		data: {
			placeId: place.placeId,
			tripId,
			name: place.name,
			sortOrder: maxOrder + 1,
			formattedAddress: place.formattedAddress,
			country: place.country,
			city: place.city,
			district: place.district,
			lat: place.lat,
			lng: place.lng,
			tags: place.tags,
			openingHours: place.openingHours,
			rating: place.rating,
			userRatingsTotal: place.userRatingsTotal,
			reviews: {
				create: [
					...place.reviews.map((review) => ({
						authorName: review.authorName,
						authorUrl: review.authorUrl,
						language: review.language,
						profilePhotoUrl: review.profilePhotoUrl,
						rating: review.rating,
						relativeTimeDescription: review.relativeTimeDescription,
						text: review.text,
						postedAt: review.postedAt
					}))
				]
			}
		}
	});

	revalidatePath(`/trips/${tripId}`);

	return newPlace;
}

export async function updatePlace(
	id: string,
	updates: Partial<Place>
): Promise<PlaceModel> {
	const updatedPlace = await prisma.place.update({
		where: { id },
		data: updates,
		include: { reviews: true }
	});

	const updatedPlaceModel = { ...updatedPlace, photos: [] };

	revalidatePath(`/trips/${updatedPlace.tripId}`);

	return updatedPlaceModel;
}

export async function updatePlaceDate(
	id: string,
	date: Date
): Promise<PlaceModel> {
	const maxDateSortOrderPlace = await prisma.place.aggregate({
		_max: {
			dateSortOrder: true
		},
		where: {
			placeId: id,
			date
		}
	});

	const maxDateSortOrder = maxDateSortOrderPlace._max?.dateSortOrder || 0;

	const updatedPlace = await prisma.place.update({
		where: { id },
		data: {
			date,
			dateSortOrder: maxDateSortOrder + 1
		},
		include: { reviews: true }
	});

	const updatedPlaceModel = { ...updatedPlace, photos: [] };

	revalidatePath(`/trips/${updatedPlace.tripId}`);

	return updatedPlaceModel;
}

export async function deletePlace(id: string): Promise<void> {
	const deletedPlace = await prisma.place.delete({
		where: { id }
	});

	revalidatePath(`/trips/${deletedPlace.tripId}`);
}

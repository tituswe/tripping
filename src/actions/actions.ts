"use server";

import { DateRange } from "react-day-picker";

import prisma from "@/lib/db";
import { LocationRequest, PlaceRequest } from "@/lib/types";
import { Place, Trip } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createTrip(
	location: LocationRequest,
	dateRange?: DateRange
) {
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
				locationType: location.locationType,
				photos: location.photos
			}
		});
	}

	const newTrip = await prisma.trip.create({
		data: {
			locationId: existingLocation.id,
			from: dateRange?.from,
			to: dateRange?.to
		},
		include: { location: true }
	});

	revalidatePath(`/trips`);

	return newTrip;
}

export async function getTrip(id: string) {
	const trip = await prisma.trip.findFirstOrThrow({
		where: { id },
		include: {
			location: true,
			places: {
				include: { reviews: true },
				orderBy: { sortOrder: "desc" }
			}
		}
	});

	return trip;
}

export async function getTrips() {
	const trips = prisma.trip.findMany({
		include: {
			location: true,
			places: {
				include: { reviews: true }
			}
		}
	});

	return trips;
}

export async function updateTrip(id: string, updates: Partial<Trip>) {
	const updatedTrip = await prisma.trip.update({
		where: { id },
		data: updates
	});

	revalidatePath(`/trips`);

	return updatedTrip;
}

export async function createPlace(tripId: string, place: PlaceRequest) {
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
			photos: place.photos,
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

export async function updatePlace(id: string, updates: Partial<Place>) {
	const updatedPlace = await prisma.place.update({
		where: { id },
		data: updates
	});

	revalidatePath(`/trips/${updatedPlace.tripId}`);

	return updatedPlace;
}

export async function deletePlace(id: string) {
	const deletedPlace = await prisma.place.delete({
		where: { id }
	});

	revalidatePath(`/trips/${deletedPlace.tripId}`);

	return deletedPlace;
}

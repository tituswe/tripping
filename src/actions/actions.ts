"use server";

import { DateRange } from "react-day-picker";

import prisma from "@/lib/db";
import { LocationRequest, PlaceRequest } from "@/lib/types";
import { Trip } from "@prisma/client";
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

export async function updateTrip(id: string, updates: Partial<Trip>) {
	const updatedTrip = await prisma.trip.update({
		where: { id },
		data: updates
	});

	revalidatePath(`/trips`);

	return updatedTrip;
}

export async function createPlace(tripId: string, place: PlaceRequest) {
	const newPlace = await prisma.place.create({
		data: {
			placeId: place.placeId,
			tripId,
			name: place.name,
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

export async function deletePlace(id: string) {
	const deletedPlace = await prisma.place.delete({
		where: { id }
	});

	revalidatePath(`/trips/${deletedPlace.tripId}`);

	return deletedPlace;
}

export async function createTripItem(tripTitle: string, formData: any) {
	// const trip = await prisma.trip.findUniqueOrThrow({
	// 	where: { title: tripTitle }
	// });
	// await prisma.tripItem.create({
	// 	data: {
	// 		name: formData.name,
	// 		address: formData.address,
	// 		activity: formData.activity,
	// 		description: formData.description,
	// 		price: formData.price,
	// 		tripId: trip.id,
	// 		media: formData.media,
	// 		from: formData.from,
	// 		to: formData.to
	// 	}
	// });
	// revalidatePath(`/trips/${tripTitle}`);
}

export async function updateTripItem(
	tripTitle: string,
	tripItemId: string | undefined,
	formData: any
) {
	// if (!tripItemId) return;
	// await prisma.tripItem.update({
	// 	where: { id: tripItemId },
	// 	data: {
	// 		name: formData.name,
	// 		address: formData.address,
	// 		activity: formData.activity,
	// 		description: formData.description,
	// 		price: formData.price,
	// 		media: formData.media,
	// 		from: formData.from,
	// 		to: formData.to
	// 	}
	// });
	// revalidatePath(`/trips/${tripTitle}`);
}

export async function deleteTripItem(tripTitle: string, tripItemId: string) {
	// await prisma.tripItem.delete({
	// 	where: { id: tripItemId }
	// });
	// revalidatePath(`/trips/${tripTitle}`);
}

export async function deleteTripItems(
	tripTitle: string,
	tripItemIds: string[]
) {
	// await prisma.tripItem.deleteMany({
	// 	where: {
	// 		id: {
	// 			in: tripItemIds
	// 		}
	// 	}
	// });
	// revalidatePath(`/trips/${tripTitle}`);
}

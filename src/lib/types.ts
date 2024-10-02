import { Location, Place, PlaceReview, Prisma } from "@prisma/client";

export type LocationRequest = Omit<Location, "id" | "createdAt" | "updatedAt">;

export type PlaceRequest = Omit<
	Place,
	"id" | "createdAt" | "updatedAt" | "sortOrder"
> & {
	reviews: PlaceReview[];
};

export type TripModel = Prisma.TripGetPayload<{
	include: {
		location: true;
		places: {
			include: { reviews: true };
		};
	};
}>;

export type PlaceModel = Prisma.PlaceGetPayload<{
	include: { reviews: true };
}>;

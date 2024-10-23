import { Location, Place, PlaceReview, Prisma } from "@prisma/client";

export type LocationRequest = Omit<Location, "id" | "createdAt" | "updatedAt">;

export type PlaceRequest = Omit<
	Place,
	"id" | "createdAt" | "updatedAt" | "sortOrder"
> & {
	reviews: PlaceReview[];
};

export type PlaceModel = Prisma.PlaceGetPayload<{
	include: { reviews: true };
}> & { photos: string[] };

export type TripModel = Prisma.TripGetPayload<{
	include: {
		location: true;
		places: true; // Include places
		creator: true;
		invited: true;
	};
}> & {
	location: {
		photos: string[]; // Move photos under location
	};
	places: PlaceModel[]; // Specify the type for places
};

export type UserModel = Prisma.UserGetPayload<{}>;

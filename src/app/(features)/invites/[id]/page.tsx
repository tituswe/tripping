import { getTripInvite, joinTrip } from "@/actions/actions";
import { TripInviteModel } from "@/lib/types";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
	const tripInvite: TripInviteModel = await getTripInvite(params.id);

	let trip;
	try {
		trip = await joinTrip(tripInvite.trip.id);
	} catch (error) {
		console.error("Failed to join trip:", error);
	}

	redirect(`/trips/${tripInvite.tripId}`);
}

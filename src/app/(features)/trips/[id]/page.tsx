import { getTrip } from "@/actions/actions";
import { auth } from "@/lib/auth";
import { TripModel } from "@/lib/types";
import { redirect } from "next/navigation";
import { Client } from "./client";

export default async function Page({ params }: { params: { id: string } }) {
	const trip: TripModel = await getTrip(params.id);
	const session = await auth();

	if (!session || !session.user?.email) {
		redirect("/dashboard");
	}

	if (
		!trip.invited.map((user) => user.email).includes(session.user?.email) &&
		trip.creator.email !== session.user?.email
	) {
		redirect("/dashboard");
	}

	return <Client trip={trip} />;
}

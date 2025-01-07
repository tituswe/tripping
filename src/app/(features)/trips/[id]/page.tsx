import { getTrip, getUsers } from "@/actions/actions";
import { auth } from "@/lib/auth";
import { TripModel, UserModel } from "@/lib/types";
import { redirect } from "next/navigation";
import { TripClient } from "./client";

export default async function TripPage({ params }: { params: { id: string } }) {
	const users: UserModel[] = await getUsers();
	const trip: TripModel = await getTrip(params.id);
	const session = await auth();

	if (!session) {
		redirect("/dashboard");
	}

	if (session.user?.email !== trip.creator.email) {
		redirect("/dashboard");
	}

	return <TripClient users={users} trip={trip} />;
}

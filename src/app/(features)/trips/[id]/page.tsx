import { getTrip, getUsers } from "@/actions/actions";
import { TripModel, UserModel } from "@/lib/types";
import { TripClient } from "./client";

export default async function TripPage({ params }: { params: { id: string } }) {
	const users: UserModel[] = await getUsers();
	const trip: TripModel = await getTrip(params.id);

	return <TripClient trip={trip} />;
	// return <TripContentWithAPIProvider users={users} trip={trip} />;
}

import { getTrip, getUsers } from "@/actions/actions";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { TripContentWithAPIProvider } from "@/components/trip/trip-content";
import { TripModel, UserModel } from "@/lib/types";

export default async function TripPage({ params }: { params: { id: string } }) {
	const users: UserModel[] = await getUsers();
	const trip: TripModel = await getTrip(params.id);

	return (
		<ContentLayout title={`Trip to ${trip?.location.formattedAddress}`}>
			<TripContentWithAPIProvider users={users} trip={trip} />
		</ContentLayout>
	);
}

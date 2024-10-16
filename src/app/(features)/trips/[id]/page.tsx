import { getTrip } from "@/actions/actions";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { TripContentWithAPIProvider } from "@/components/trip/trip-content";
import { TripModel } from "@/lib/types";

export default async function TripPage({ params }: { params: { id: string } }) {
	const trip: TripModel = await getTrip(params.id);

	return (
		<ContentLayout title={`Trip to ${trip?.location.formattedAddress}`}>
			<TripContentWithAPIProvider trip={trip} />
		</ContentLayout>
	);
}

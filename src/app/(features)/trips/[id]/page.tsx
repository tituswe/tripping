import { getTrip } from "@/actions/actions";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { TripContent } from "@/components/trip/trip-content";
import { TripHeader } from "@/components/trip/trip-header";
import { TripModel } from "@/lib/types";

export default async function TripPage({ params }: { params: { id: string } }) {
	const trip: TripModel = await getTrip(params.id);

	return (
		<ContentLayout title={`Trip to ${trip?.location.formattedAddress}`}>
			<TripHeader trip={trip} />
			<TripContent trip={trip} />
			{/* <TripItems tripTitle={tripTitle} trip={trip} tripItems={tripItems} /> */}
		</ContentLayout>
	);
}

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { TripContent } from "@/components/trip/trip-content";
import { TripHeader } from "@/components/trip/trip-header";
import prisma from "@/lib/db";
import { TripModel } from "@/lib/types";

export default async function TripPage({ params }: { params: { id: string } }) {
	const trip: TripModel = await prisma.trip.findFirstOrThrow({
		where: { id: params.id },
		include: {
			location: true,
			places: {
				include: { reviews: true }
			}
		}
	});

	return (
		<ContentLayout title={`Trip to ${trip?.location.formattedAddress}`}>
			<TripHeader trip={trip} />
			<TripContent trip={trip} />
			{/* <TripItems tripTitle={tripTitle} trip={trip} tripItems={tripItems} /> */}
		</ContentLayout>
	);
}

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { NewTrip } from "../../../../components/trip/new-trip";

export default function NewTripPage() {
	return (
		<ContentLayout title="New Trip">
			<NewTrip />
		</ContentLayout>
	);
}

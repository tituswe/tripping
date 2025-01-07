import { NewTrip } from "@/app/(features)/trips/new/components/new-trip";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function NewTripPage() {
	return (
		<ContentLayout title="New Trip">
			<NewTrip />
		</ContentLayout>
	);
}

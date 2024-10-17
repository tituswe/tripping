import { getTrips } from "@/actions/actions";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { DashboardWithAPIProvider } from "@/components/dashboard/dashboard";

export default async function DashboardPage() {
	const trips = await getTrips();

	return (
		<ContentLayout title="Dashboard">
			<DashboardWithAPIProvider trips={trips} />
		</ContentLayout>
	);
}

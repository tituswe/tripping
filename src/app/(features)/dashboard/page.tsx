import { getTrips } from "@/actions/actions";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { DashboardWithAPIProvider } from "@/components/dashboard/dashboard";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
	const session = await auth();
	const trips = await getTrips(session?.user?.email);

	return (
		<ContentLayout title="Dashboard">
			<DashboardWithAPIProvider trips={trips} />
		</ContentLayout>
	);
}

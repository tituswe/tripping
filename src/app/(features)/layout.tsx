import { getTrips } from "@/actions/actions";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";

export default async function TabLayout({
	children
}: {
	children: React.ReactNode;
}) {
	const trips = await getTrips();

	return <AdminPanelLayout trips={trips}>{children}</AdminPanelLayout>;
}

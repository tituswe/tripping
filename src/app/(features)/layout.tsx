import { getTrips } from "@/actions/actions";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { auth } from "@/lib/auth";

export default async function TabLayout({
	children
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	const trips = await getTrips(session?.user?.email);

	return <AdminPanelLayout trips={trips}>{children}</AdminPanelLayout>;
}

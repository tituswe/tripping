import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import prisma from "@/lib/db";
import { TripModel } from "@/lib/types";

export default async function TabLayout({
	children
}: {
	children: React.ReactNode;
}) {
	const trips: TripModel[] = await prisma.trip.findMany({
		include: { location: true, places: { include: { reviews: true } } }
	});

	return <AdminPanelLayout trips={trips}>{children}</AdminPanelLayout>;
}

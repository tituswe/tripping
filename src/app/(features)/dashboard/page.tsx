import { getTrips } from "@/actions/actions";
import { Dashboard } from "./components/dashboard";

export default async function DashboardPage() {
	const trips = await getTrips();

	return <Dashboard trips={trips} />;
}

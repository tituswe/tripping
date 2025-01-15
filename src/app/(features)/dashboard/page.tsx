import { getTrips } from "@/actions/actions";
import { Dashboard } from "./components/dashboard";

export default async function Page() {
	const trips = await getTrips();

	return <Dashboard trips={trips} />;
}

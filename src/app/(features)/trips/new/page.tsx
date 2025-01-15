import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Client } from "./client";

export default function Page() {
	return (
		<ContentLayout title="New Trip">
			<Client />
		</ContentLayout>
	);
}

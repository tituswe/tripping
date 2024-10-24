import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";

export default async function TabLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return <AdminPanelLayout>{children}</AdminPanelLayout>;
}

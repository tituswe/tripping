import { Sidebar } from "@/components/admin-panel/sidebar";

interface AdminPanelLayoutProps {
	children: React.ReactNode;
}

export default function AdminPanelLayout({ children }: AdminPanelLayoutProps) {
	return (
		<>
			<Sidebar />
			<main className="min-h-[100vh] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300 lg:ml-[72px]">
				{children}
			</main>
		</>
	);
}

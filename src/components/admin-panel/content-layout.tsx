import { Navbar } from "@/components/admin-panel/navbar";

interface ContentLayoutProps {
	title: string;
	children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
	return (
		<>
			<Navbar title={title} />
			{children}
		</>
	);
}

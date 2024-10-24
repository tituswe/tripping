interface ContentLayoutProps {
	title: string;
	children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
	return <>{children}</>;
}

import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/theme-provider";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.APP_URL
			? `${process.env.APP_URL}`
			: process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: `http://localhost:${process.env.PORT || 3000}`
	),
	title: "trippin",
	description: "Trip around and you'll find out.",
	alternates: {
		canonical: "/"
	},
	openGraph: {
		url: "/",
		title: "trippin",
		description: "Trip around and you'll find out.",
		type: "website"
	},
	twitter: {
		card: "summary_large_image",
		title: "trippin",
		description: "Plan trips, make memories."
	}
};

export default function RootLayout({
	children,
	params: { session }
}: Readonly<{
	children: React.ReactNode;
	params: { session: Session | null | undefined };
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={GeistSans.className}>
				<SessionProvider session={session} refetchInterval={5 * 60}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						{children}
						<Toaster />
					</ThemeProvider>
				</SessionProvider>
				<Analytics />
			</body>
		</html>
	);
}

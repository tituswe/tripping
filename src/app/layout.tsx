import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "Tripping",
  description: "Plan trips, make memories.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    url: "/",
    title: "Tripping",
    description: "Plan trips, make memories.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Tripping",
    description: "Plan trips, make memories."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

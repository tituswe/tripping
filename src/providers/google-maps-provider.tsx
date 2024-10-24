"use client";

import { APIProvider } from "@vis.gl/react-google-maps";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const libraries = ["places", "marker"];

interface GoogleMapsProviderProps {
	children: React.ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
	return (
		<APIProvider apiKey={API_KEY} libraries={libraries}>
			{children}
		</APIProvider>
	);
}

import axios from "axios";
import { NextResponse } from "next/server";

interface PlacePhotoResponse {
	photoUrl?: string;
	error?: string;
}

export async function GET(req: Request): Promise<NextResponse> {
	const googleApiKey = process.env.NEXT_SERVER_GOOGLE_MAPS_API_KEY;

	// Get the placeId from the URL query parameters
	const { searchParams } = new URL(req.url);
	const placeId = searchParams.get("placeId");

	// Validate placeId
	if (!placeId) {
		return NextResponse.json(
			{ error: "placeId query parameter is required" },
			{ status: 400 }
		);
	}

	try {
		// Fetch place details from Google Places API to get the photo reference
		const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${googleApiKey}`;
		const placeResponse = await axios.get(placeDetailsUrl);
		const placeData = placeResponse.data;

		if (placeData.result.photos && placeData.result.photos.length > 0) {
			// Get the photo reference
			const photoReference = placeData.result.photos[0].photo_reference;

			// Construct the photo URL
			const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${googleApiKey}`;

			// Return the photo URL in the response
			const response: PlacePhotoResponse = { photoUrl };
			return NextResponse.json(response, { status: 200 });
		} else {
			return NextResponse.json(
				{ error: "No photo available for this place." },
				{ status: 404 }
			);
		}
	} catch (error) {
		console.error("Error fetching place details:", error);
		return NextResponse.json(
			{ error: "Failed to fetch place photo." },
			{ status: 500 }
		);
	}
}

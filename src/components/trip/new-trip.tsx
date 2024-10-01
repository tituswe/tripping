"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createTrip } from "@/actions/actions";
import { DateTimeInput } from "@/components/custom-ui/date-time-input";
import { LocationInput } from "@/components/custom-ui/location-input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LocationRequest } from "@/lib/types";
import { placeType } from "@/lib/utils";
import { Plane } from "lucide-react";
import { DateRange } from "react-day-picker";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export function NewTrip() {
	const router = useRouter();
	const { toast } = useToast();
	const [location, setLocation] = useState<LocationRequest | undefined>();
	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: undefined,
		to: undefined
	});

	const onPlaceSelect = (place: google.maps.places.PlaceResult | null) => {
		if (!place) return;

		if (!place.place_id) return;

		const country =
			place.address_components?.find((comp) => comp.types.includes("country"))
				?.long_name || null;
		const city =
			place.address_components?.find((comp) =>
				comp.types.includes("administrative_area_level_1")
			)?.long_name || null;
		const district =
			place.address_components?.find((comp) => comp.types.includes("locality"))
				?.long_name || null;

		const photos = place.photos?.map((photo) => photo.getUrl()) || [];

		setLocation({
			placeId: place.place_id,
			name: place.name || null,
			formattedAddress: place.formatted_address || null,
			country,
			city,
			district,
			lat: place.geometry?.location?.lat() || null,
			lng: place.geometry?.location?.lng() || null,
			locationType: placeType(place.types),
			photos
		});
	};

	const onSubmit = async () => {
		if (!location) return;

		try {
			const response = await createTrip(location, dateRange);
			toast({
				title: "You're set!",
				description: `Trip to ${response.location.formattedAddress}${
					response.from ? ` from ${response.from.toDateString()}` : ""
				}${response.to ? ` to ${response.to.toDateString()}` : ""} created.`
			});
			router.push(`/trips/${response.id}`);
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.message || "There was an error creating your trip.",
				variant: "destructive"
			});
		}
	};

	return (
		<APIProvider apiKey={API_KEY}>
			<div className="w-full h-screen flex justify-center items-center">
				<div className="flex flex-col w-[600px] space-y-3 mb-24">
					<h2 className="font-semibold text-4xl">Plan a new trip</h2>
					<LocationInput
						selectedPlace={location?.formattedAddress}
						onPlaceSelect={onPlaceSelect}
					/>
					<DateTimeInput dateRange={dateRange} setDateRange={setDateRange} />
					<div className="w-full pt-6 flex justify-center">
						<Button size="xl" onClick={onSubmit} disabled={!location}>
							<Plane className="mr-2 h-6 w-6" />{" "}
							<span className="text-lg">Let's go!</span>
						</Button>
					</div>
					<Map
						defaultZoom={3}
						defaultCenter={{ lat: 22.54992, lng: 0 }}
						gestureHandling={"greedy"}
						disableDefaultUI={true}
					/>
				</div>
			</div>
		</APIProvider>
	);
}

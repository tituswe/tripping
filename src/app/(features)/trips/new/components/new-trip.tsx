"use client";

import { createTrip } from "@/actions/actions";
import { DateTimeInput } from "@/components/custom-ui/date-time-input";
import { LocationInput } from "@/components/custom-ui/location-input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { LocationRequest } from "@/lib/types";
import { placeType } from "@/lib/utils";
import { useMap } from "@vis.gl/react-google-maps";
import { Plane } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export function NewTrip() {
	const map = useMap();
	const { toast } = useToast();
	const router = useRouter();
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

		setLocation({
			placeId: place.place_id,
			name: place.name || null,
			formattedAddress: place.formatted_address || null,
			country,
			city,
			district,
			lat: place.geometry?.location?.lat() || null,
			lng: place.geometry?.location?.lng() || null,
			locationType: placeType(place.types)
		});

		if (place.geometry?.location) {
			map?.setZoom(8);
			map?.panTo({
				lat: place.geometry?.location?.lat(),
				lng: place.geometry?.location?.lng()
			});
		}
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
		<div className="absolute inset-0 flex items-center justify-center z-10">
			<Card className="p-24 backdrop-blur-md bg-white/30">
				<h1 className="text-2xl font-medium">Where are we going?</h1>
				<p className="text-sm text-muted-foreground mt-1.5">
					Start your trip by picking your next travel destination
				</p>
				<Separator className="mt-6 bg-muted-foreground/50" />
				<div className="flex mt-6 text-sm font-medium text-foreground">
					<p className="mr-[120px]">Travel destination</p>
					<p>Duration of your trip</p>
				</div>
				<div className="flex mt-3">
					<LocationInput
						selectedPlace={location?.formattedAddress}
						onPlaceSelect={onPlaceSelect}
					/>
					<DateTimeInput dateRange={dateRange} setDateRange={setDateRange} />
				</div>
				<div className="flex justify-end mt-6">
					<Button
						className="ml-auto md:ml-6 flex-shrink-0 rounded-full"
						disabled={!location}
						onClick={onSubmit}
					>
						<Plane className="h-5 w-5" />
						<p className="ml-3">Start planning</p>
					</Button>
				</div>
			</Card>
		</div>
	);
}

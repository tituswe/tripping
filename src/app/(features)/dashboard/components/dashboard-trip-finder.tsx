"use client";

import { createTrip } from "@/actions/actions";
import { DateTimeInput } from "@/components/custom-ui/date-time-input";
import { LocationInput } from "@/components/custom-ui/location-input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useToast } from "@/hooks/use-toast";
import { LocationRequest, TripModel } from "@/lib/types";
import { placeType } from "@/lib/utils";
import { GoogleMapsProvider } from "@/providers/google-maps-provider";
import { Map, useMap } from "@vis.gl/react-google-maps";
import { Plane, PlaneTakeoff } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
	DashboardUpcomingTripCard,
	DashboardUpcomingTripCardHorizontal
} from "./dashboard-upcoming-trip-card";

interface DashboardTripFinderProps {
	trips: TripModel[];
}

function DashboardTripFinderContent({ trips }: DashboardTripFinderProps) {
	const { data: session } = useSession();
	const map = useMap();
	const { toast } = useToast();
	const router = useRouter();
	const coordinates = useGeolocation();
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
		<div className="border rounded-xl md:rounded-l-xl flex">
			<div className="w-[640px]">
				<div className="p-8">
					<PlaneTakeoff className="h-8 w-8" />
					{trips.length ? (
						<>
							<p className="text-lg font-medium mt-6">Upcoming trips</p>
							<ScrollArea className="md:hidden max-h-56">
								<div className="flex flex-col space-y-3 py-3">
									{trips.map((trip, index) => (
										<DashboardUpcomingTripCardHorizontal
											key={index}
											trip={trip}
										/>
									))}
								</div>
							</ScrollArea>
							<ScrollArea className="hidden md:block w-auto mt-3 pb-3">
								<div className="flex w-max space-x-5">
									{trips.map((trip, index) => (
										<DashboardUpcomingTripCard key={index} trip={trip} />
									))}
								</div>
								<ScrollBar orientation="horizontal" />
							</ScrollArea>
						</>
					) : (
						<>
							<p className="text-lg font-medium mt-6">No trips ... for now!</p>
							<p className="text-sm text-muted-foreground mt-1.5">
								Start planning your next adventure here.
							</p>
						</>
					)}
					{session?.user ? (
						<>
							<p
								className={`${
									trips.length ? "mt-3" : "mt-6"
								} text-sm font-medium text-secondary-foreground`}
							>
								Where to{trips.length ? " next" : ""}?
							</p>
							<div className="mt-3 flex flex-col space-y-3 md:space-y-0 md:flex-row">
								<LocationInput
									selectedPlace={location?.formattedAddress}
									onPlaceSelect={onPlaceSelect}
								/>
								<DateTimeInput
									dateRange={dateRange}
									setDateRange={setDateRange}
								/>
								<Button
									size={"lgIcon"}
									className="ml-auto md:ml-6 flex-shrink-0"
									disabled={!location}
									onClick={onSubmit}
								>
									<Plane className="h-6 w-6" />
								</Button>
							</div>
						</>
					) : (
						<Link href="/sign-in">
							<Button className="mt-6 rounded-full">Start searching</Button>
						</Link>
					)}
				</div>
			</div>
			<div className="hidden md:block border-l ring-4 ring-muted rounded-md flex-grow">
				<Map
					defaultZoom={8}
					defaultCenter={coordinates}
					gestureHandling={"greedy"}
					disableDefaultUI={true}
				/>
			</div>
		</div>
	);
}

interface DashboardTripFinderProps {
	trips: TripModel[];
}

export function DashboardTripFinder({ trips }: DashboardTripFinderProps) {
	return (
		<GoogleMapsProvider>
			<DashboardTripFinderContent trips={trips} />
		</GoogleMapsProvider>
	);
}

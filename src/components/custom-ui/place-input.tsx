"use client";

import { PlaceModel } from "@/lib/types";
import { cn, placeType } from "@/lib/utils";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "../ui/badge";

interface Props {
	selectedPlace?: string | null;
	existingPlaces?: PlaceModel[];
	onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export const PlaceInput = ({
	selectedPlace,
	existingPlaces,
	onPlaceSelect
}: Props) => {
	const map = useMap();
	const places = useMapsLibrary("places");

	const [sessionToken, setSessionToken] =
		useState<google.maps.places.AutocompleteSessionToken>();

	const [autocompleteService, setAutocompleteService] =
		useState<google.maps.places.AutocompleteService | null>(null);

	const [placesService, setPlacesService] =
		useState<google.maps.places.PlacesService | null>(null);

	const [predictionResults, setPredictionResults] = useState<
		Array<google.maps.places.AutocompletePrediction>
	>([]);

	const [inputValue, setInputValue] = useState<string>("");

	const [selectedIndex, setSelectedIndex] = useState(0);

	const [isFocused, setIsFocused] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!places || !map) return;

		setAutocompleteService(new places.AutocompleteService());
		setPlacesService(new places.PlacesService(map));
		setSessionToken(new places.AutocompleteSessionToken());

		return () => setAutocompleteService(null);
	}, [map, places]);

	const fetchPredictions = useCallback(
		async (inputValue: string) => {
			if (!autocompleteService || !inputValue) {
				setPredictionResults([]);
				return;
			}

			const request = { input: inputValue, sessionToken };
			const response = await autocompleteService.getPlacePredictions(request);

			const existingPlaceIds =
				existingPlaces?.map((place) => place.placeId) || [];
			const filteredPlaces = response.predictions.filter(
				(pred) => !existingPlaceIds.includes(pred.place_id)
			);

			setPredictionResults(filteredPlaces);
			setSelectedIndex(0); // Reset selected index when new predictions are fetched
		},
		[autocompleteService, sessionToken]
	);

	const onInputChange = useCallback(
		(event: FormEvent<HTMLInputElement>) => {
			const value = (event.target as HTMLInputElement)?.value;

			setInputValue(value);
			fetchPredictions(value);
		},
		[fetchPredictions]
	);

	const handleSuggestionClick = useCallback(
		(placeId: string) => {
			if (!places) return;

			const detailRequestOptions = {
				placeId,
				fields: [
					"geometry",
					"name",
					"formatted_address",
					"place_id",
					"types",
					"address_components",
					"photos",
					"opening_hours",
					"rating",
					"user_ratings_total",
					"reviews"
				],
				sessionToken
			};

			const detailsRequestCallback = (
				placeDetails: google.maps.places.PlaceResult | null
			) => {
				onPlaceSelect(placeDetails);
				setPredictionResults([]);
				setInputValue("");
				setSessionToken(new places.AutocompleteSessionToken());
			};

			placesService?.getDetails(detailRequestOptions, detailsRequestCallback);
		},
		[onPlaceSelect, places, placesService, sessionToken]
	);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (predictionResults.length === 0) return;

		switch (event.key) {
			case "ArrowDown":
				setSelectedIndex((prevIndex) =>
					Math.min(prevIndex + 1, predictionResults.length - 1)
				);
				break;
			case "ArrowUp":
				setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
				break;
			case "Enter":
				handleSuggestionClick(predictionResults[selectedIndex].place_id);
				break;
			case "Escape":
				inputRef.current?.blur();
				break;
			default:
				break;
		}
	};

	const handleBlur = () => {
		setIsFocused(false);
		if (selectedPlace) {
			setInputValue(selectedPlace);
		}
	};

	return (
		<div className="autocomplete-container relative space-y-1">
			<MapPin className="absolute top-3 left-3 w-5 h-5 text-muted-foreground" />
			<input
				value={inputValue}
				className={cn(
					"flex h-12 w-full rounded-md border border-input bg-transparent pr-3 py-2 pl-9 text-md font-semibold shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
				)}
				onInput={(event: FormEvent<HTMLInputElement>) => onInputChange(event)}
				onKeyDown={handleKeyDown}
				onFocus={() => setIsFocused(true)}
				onBlur={handleBlur}
				placeholder="Find a place..."
				ref={inputRef}
			/>

			{isFocused && predictionResults.length > 0 && (
				<ul className="absolute top-14 w-full z-10 border rounded bg-background">
					{predictionResults.map(
						({ place_id, structured_formatting, types }, index) => {
							const type = placeType(types);
							return (
								<li
									key={place_id}
									className={cn(
										"p-3 flex flex-row border-b transition hover:bg-secondary cursor-pointer",
										{
											"bg-secondary": index === selectedIndex
										}
									)}
									onClick={() => handleSuggestionClick(place_id)}
								>
									<div className="flex flex-col">
										<span className="font-semibold">
											{structured_formatting.main_text}
										</span>
										<span className="text-sm text-muted-foreground">
											{structured_formatting.secondary_text}
										</span>
									</div>
									{type && (
										<div className="ml-auto flex items-center">
											<Badge variant="secondary">{type}</Badge>
										</div>
									)}
								</li>
							);
						}
					)}
				</ul>
			)}
		</div>
	);
};

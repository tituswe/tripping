"use client";

import { Badge } from "@/components/ui/badge";
import { cn, placeType } from "@/lib/utils";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

interface Props {
	selectedPlace?: string | null;
	onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export const LocationInput = ({ selectedPlace, onPlaceSelect }: Props) => {
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

			const filteredPredictions = response.predictions.filter(
				(pred) =>
					pred.types.includes("country") ||
					pred.types.includes("administrative_area_level_1") ||
					pred.types.includes("locality")
			);

			setPredictionResults(filteredPredictions);
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
					"address_components"
				],
				sessionToken
			};

			const detailsRequestCallback = (
				placeDetails: google.maps.places.PlaceResult | null
			) => {
				onPlaceSelect(placeDetails);
				setPredictionResults([]);
				setInputValue(placeDetails?.formatted_address ?? "");
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
		if (selectedPlace) {
			setInputValue(selectedPlace);
		}
	};

	return (
		<div className="autocomplete-container relative space-y-3">
			<input
				value={inputValue}
				className={cn(
					"flex h-12 w-full rounded-l-full rounded-r-full md:rounded-r-none border border-input bg-transparent px-5 py-2 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
				)}
				onInput={(event: FormEvent<HTMLInputElement>) => onInputChange(event)}
				onKeyDown={handleKeyDown}
				onFocus={() => setIsFocused(true)}
				onBlur={handleBlur}
				placeholder="Start searching"
				ref={inputRef}
			/>

			{isFocused && predictionResults.length > 0 && (
				<ul className="absolute top-12 w-full z-10 border rounded-xl bg-background">
					{predictionResults.map(
						({ place_id, structured_formatting, types }, index) => {
							const type = placeType(types);
							return (
								<li
									key={place_id}
									className={cn(
										"p-3 flex flex-row border-b transition hover:bg-secondary cursor-pointer",
										{
											"rounded-t-xl": index === 0
										},
										{
											"rounded-b-xl": index === predictionResults.length - 1
										},
										{
											"bg-secondary": index === selectedIndex
										}
									)}
									onClick={() => handleSuggestionClick(place_id)}
								>
									<div className="flex flex-col">
										<span className="font-medium text-sm">
											{structured_formatting.main_text}
										</span>
										<span className="text-xs text-muted-foreground">
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

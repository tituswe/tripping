"use client";

import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Search, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaceModel } from "@/lib/types";
import { cn, placeType } from "@/lib/utils";

interface TripSearchProps {
	disabled?: boolean;
	selectedPlace?: string | null;
	existingPlaces?: PlaceModel[];
	onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export function TripSearch({
	disabled,
	selectedPlace,
	existingPlaces,
	onPlaceSelect
}: TripSearchProps) {
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
		[autocompleteService, sessionToken, existingPlaces]
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
		if (selectedPlace) {
			setInputValue(selectedPlace);
		}
	};

	const handleCancel = () => {
		setInputValue("");
		setPredictionResults([]);
	};

	return (
		<div className="autocomplete-container relative">
			<Search className="absolute top-3.5 left-3 w-3 h-3 text-muted-foreground" />
			<Button
				size="icon"
				variant="ghost"
				className="absolute top-1.5 right-1.5"
				onClick={handleCancel}
			>
				<X className="w-3 h-3" />
			</Button>
			<input
				disabled={disabled}
				value={inputValue}
				className={cn(
					"flex h-10 w-full rounded-full border border-input bg-transparent py-2 px-8 text-xs font-normal shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
					{ "transition-all duration-300": isFocused }
				)}
				onInput={(event: FormEvent<HTMLInputElement>) => onInputChange(event)}
				onKeyDown={handleKeyDown}
				onFocus={() => setIsFocused(true)}
				onBlur={handleBlur}
				placeholder="Find a place..."
				ref={inputRef}
			/>

			{isFocused && predictionResults.length > 0 && (
				<ul className="absolute top-12 w-full z-30 border rounded bg-background transition-all duration-300">
					{predictionResults.map(
						({ place_id, structured_formatting, types }, index) => {
							const type = placeType(types);
							return (
								<li
									key={place_id}
									className={cn(
										"px-3 py-2 flex flex-row border-b transition hover:bg-secondary cursor-pointer",
										{
											"bg-secondary": index === selectedIndex
										}
									)}
									onClick={() => handleSuggestionClick(place_id)}
								>
									<div className="flex flex-col">
										<span className="text-xs font-normal">
											{structured_formatting.main_text}
										</span>
										<span className="text-xs font-light text-muted-foreground">
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
}

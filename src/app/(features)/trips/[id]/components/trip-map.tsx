"use client";

import React, { useCallback, useEffect } from "react";

import {
	AdvancedMarker,
	AdvancedMarkerAnchorPoint,
	AdvancedMarkerProps,
	Map,
	Pin,
	useAdvancedMarkerRef,
	useMap
} from "@vis.gl/react-google-maps";

import { useMapMarkers } from "@/hooks/use-map-markers";
import { PlaceModel, TripModel } from "@/lib/types";
import { ViewType } from "../types";
import "./trip-map.css";

interface TripMapProps {
	view: ViewType;
	trip: TripModel;
	hoveredPlace: PlaceModel | null;
	setHoveredPlace: (place: PlaceModel | null) => void;
	selectedPlace: PlaceModel | null;
	setSelectedPlace: (place: PlaceModel | null) => void;
}

export function TripMap({
	view,
	trip,
	hoveredPlace,
	setHoveredPlace,
	selectedPlace,
	setSelectedPlace
}: TripMapProps) {
	const map = useMap();
	const getMapMarkers = useMapMarkers(trip);

	const { markers, hoverZIdx, selectedZIdx, center } = getMapMarkers();

	const onMarkerClick = useCallback(
		(id: string | null) => {
			const place =
				(trip.places.find((place) => place.id === id) as PlaceModel) || null;

			setSelectedPlace(place);
		},
		[selectedPlace]
	);

	const onMouseEnter = useCallback(
		(id: string | null) => {
			const place =
				(trip.places.find((place) => place.id === id) as PlaceModel) || null;

			setHoveredPlace(place);
		},
		[hoveredPlace]
	);

	const onMouseLeave = useCallback(() => setHoveredPlace(null), []);

	const onMapClick = useCallback(() => setSelectedPlace(null), []);

	useEffect(() => {
		if (!map || !selectedPlace || !selectedPlace.lat || !selectedPlace.lng)
			return;

		const offset = view === "gallery" ? 0.016 : view === "kanban" ? 0.024 : 0;

		map.setZoom(15);
		map.panTo({ lat: selectedPlace.lat, lng: selectedPlace.lng - offset });
	}, [view, selectedPlace]);

	return (
		<Map
			mapId={"49ae42fed52588c3"}
			defaultZoom={12}
			defaultCenter={center}
			gestureHandling={"greedy"}
			onClick={onMapClick}
			clickableIcons={false}
			disableDefaultUI
		>
			{markers.map(({ id, zIndex: zIndexDefault, position, content }) => {
				let zIndex = zIndexDefault;

				if (hoveredPlace?.id === id) {
					zIndex = hoverZIdx;
				}

				if (selectedPlace?.id === id) {
					zIndex = selectedZIdx;
				}

				return (
					<React.Fragment key={id}>
						<AdvancedMarkerWithRef
							position={position}
							zIndex={zIndex}
							anchorPoint={["50%", "100%"]}
							className="custom-marker"
							style={{
								transform: `scale(${
									[hoveredPlace?.id, selectedPlace?.id].includes(id) ? 1.2 : 0.8
								})`
							}}
							onMarkerClick={() => onMarkerClick(id)}
							onMouseEnter={() => onMouseEnter(id)}
							onMouseLeave={onMouseLeave}
						>
							<Pin
								background={selectedPlace?.id === id ? "#22ccff" : null}
								borderColor={selectedPlace?.id === id ? "#1e89a1" : null}
								glyphColor={selectedPlace?.id === id ? "#0f677a" : null}
							/>
						</AdvancedMarkerWithRef>

						{/* anchor point visualization marker */}
						<AdvancedMarkerWithRef
							onMarkerClick={() => onMarkerClick(id)}
							onMouseEnter={() => onMouseEnter(id)}
							zIndex={zIndex}
							onMouseLeave={onMouseLeave}
							anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
							position={position}
						>
							<div className="text-start translate-y-3 text-md font-semibold truncate line-clamp-1 text-ellipsis rounded bg-primary-foreground px-1.5 py-0.5 outline outline-1 outline-primary">
								{content.name}
							</div>
						</AdvancedMarkerWithRef>
					</React.Fragment>
				);
			})}
		</Map>
	);
}

export const AdvancedMarkerWithRef = (
	props: AdvancedMarkerProps & {
		onMarkerClick: (marker: google.maps.marker.AdvancedMarkerElement) => void;
	}
) => {
	const { children, onMarkerClick, ...advancedMarkerProps } = props;
	const [markerRef, marker] = useAdvancedMarkerRef();

	return (
		<AdvancedMarker
			onClick={() => {
				if (marker) {
					onMarkerClick(marker);
				}
			}}
			ref={markerRef}
			{...advancedMarkerProps}
		>
			{children}
		</AdvancedMarker>
	);
};

"use client";

import React, { useCallback, useEffect } from "react";

import {
	AdvancedMarker,
	AdvancedMarkerAnchorPoint,
	AdvancedMarkerProps,
	Map,
	useAdvancedMarkerRef,
	useMap
} from "@vis.gl/react-google-maps";

import { useMapMarkers } from "@/hooks/use-map-markers";
import { PlaceModel, TripModel } from "@/lib/types";
import { TripMapWidget } from "./trip-map-widget";
import "./trip-map.css";

interface TripMapProps {
	trip: TripModel;
	hoverId: string | null;
	setHoverId: (id: string | null) => void;
	selectedPlace: PlaceModel | null;
	setSelectedPlace: (place: PlaceModel | null) => void;
}

export function TripMap({
	trip,
	hoverId,
	setHoverId,
	selectedPlace,
	setSelectedPlace
}: TripMapProps) {
	const map = useMap();
	const getMapMarkers = useMapMarkers(trip);

	const { markers, hoverZIdx, selectedZIdx, center } = getMapMarkers();

	const onMouseEnter = useCallback((id: string | null) => setHoverId(id), []);
	const onMouseLeave = useCallback(() => setHoverId(null), []);
	const onMarkerClick = useCallback(
		(id: string | null) => {
			const place =
				(trip.places.find((place) => place.id === id) as PlaceModel) || null;

			setSelectedPlace(place);
		},
		[selectedPlace]
	);

	const onMapClick = useCallback(() => {
		setSelectedPlace(null);
	}, []);

	useEffect(() => {
		if (!map || !selectedPlace || !selectedPlace.lat || !selectedPlace.lng)
			return;

		map.panTo({ lat: selectedPlace.lat, lng: selectedPlace.lng });
	}, [selectedPlace]);

	return (
		<>
			<TripMapWidget trip={trip} selectedPlace={selectedPlace} />
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

					if (hoverId === id) {
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
										[hoverId, selectedPlace?.id].includes(id) ? 1.3 : 1
									})`
								}}
								onMarkerClick={() => onMarkerClick(id)}
								onMouseEnter={() => onMouseEnter(id)}
								onMouseLeave={onMouseLeave}
							>
								{content.photos[0] ? (
									<img
										src={content.photos[0]}
										alt={content.name || id}
										className="marker-image"
									/>
								) : (
									<div />
								)}
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
								<div className="text-center translate-y-5 bg-primary-foreground bg-opacity-80 px-3 line-clamp-2 border-2 border-gray-800 rounded text-ellipsis font-semibold">
									{content.name}
								</div>
							</AdvancedMarkerWithRef>
						</React.Fragment>
					);
				})}
			</Map>
		</>
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

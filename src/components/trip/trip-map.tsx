"use client";

import React, { useCallback, useState } from "react";

import {
	AdvancedMarker,
	AdvancedMarkerAnchorPoint,
	AdvancedMarkerProps,
	InfoWindow,
	Map,
	useAdvancedMarkerRef
} from "@vis.gl/react-google-maps";

import { useMapMarkers } from "@/hooks/use-map-markers";
import { TripModel } from "@/lib/types";
import "./trip-map.css";

interface TripMapProps {
	trip: TripModel;
	hoverId: string | null;
	setHoverId: (id: string | null) => void;
}

export function TripMap({ trip, hoverId, setHoverId }: TripMapProps) {
	const getMapMarkers = useMapMarkers(trip);

	const { markers, hoverZIdx, selectedZIdx, center } = getMapMarkers();

	const [selectedId, setSelectedId] = useState<string | null>(null);

	const [selectedMarker, setSelectedMarker] =
		useState<google.maps.marker.AdvancedMarkerElement | null>(null);
	const [infoWindowShown, setInfoWindowShown] = useState(false);

	const onMouseEnter = useCallback((id: string | null) => setHoverId(id), []);
	const onMouseLeave = useCallback(() => setHoverId(null), []);
	const onMarkerClick = useCallback(
		(id: string | null, marker?: google.maps.marker.AdvancedMarkerElement) => {
			setSelectedId(id);

			if (marker) {
				setSelectedMarker(marker);
			}

			if (id !== selectedId) {
				setInfoWindowShown(true);
			} else {
				setInfoWindowShown((isShown) => !isShown);
			}
		},
		[selectedId]
	);

	const onMapClick = useCallback(() => {
		setSelectedId(null);
		setSelectedMarker(null);
		setInfoWindowShown(false);
	}, []);

	const handleInfowindowCloseClick = useCallback(
		() => setInfoWindowShown(false),
		[]
	);

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

				if (hoverId === id) {
					zIndex = hoverZIdx;
				}

				if (selectedId === id) {
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
									[hoverId, selectedId].includes(id) ? 1.5 : 1
								})`
							}}
							onMarkerClick={(
								marker: google.maps.marker.AdvancedMarkerElement
							) => onMarkerClick(id, marker)}
							onMouseEnter={() => onMouseEnter(id)}
							onMouseLeave={onMouseLeave}
						>
							<img
								src={content.photos[0]}
								alt={content.name || id}
								className="marker-image"
							/>
						</AdvancedMarkerWithRef>

						{/* anchor point visualization marker */}
						<AdvancedMarkerWithRef
							onMarkerClick={(
								marker: google.maps.marker.AdvancedMarkerElement
							) => onMarkerClick(id, marker)}
							zIndex={zIndex}
							onMouseEnter={() => onMouseEnter(id)}
							onMouseLeave={onMouseLeave}
							anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
							position={position}
						>
							<div className="visualization-marker" />
						</AdvancedMarkerWithRef>
					</React.Fragment>
				);
			})}

			{infoWindowShown && selectedMarker && (
				<InfoWindow
					anchor={selectedMarker}
					onCloseClick={handleInfowindowCloseClick}
				>
					<h2>Marker {selectedId}</h2>
					<p>CREATE THIS WIDGET</p>
				</InfoWindow>
			)}
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

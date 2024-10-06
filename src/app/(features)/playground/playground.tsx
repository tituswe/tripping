"use client";

import React, { useCallback, useState } from "react";

import {
	AdvancedMarker,
	AdvancedMarkerAnchorPoint,
	AdvancedMarkerProps,
	APIProvider,
	InfoWindow,
	Map,
	useAdvancedMarkerRef
} from "@vis.gl/react-google-maps";

import { PlaceModel, TripModel } from "@/lib/types";
import "./style.css";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export type AnchorPointName = keyof typeof AdvancedMarkerAnchorPoint;

type MarkerData = Array<{
	id: string;
	position: google.maps.LatLngLiteral;
	zIndex: number;
	content: PlaceModel;
}>;

const libraries = ["marker"];

interface PlaygroundProps {
	trip: TripModel;
}

const Playground = ({ trip }: PlaygroundProps) => {
	const { data, hoverZIdx, selectedZIdx, center } = getMarkers(trip);

	const [markers] = useState(data);
	console.log(markers);

	const [hoverId, setHoverId] = useState<string | null>(null);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const [anchorPoint, setAnchorPoint] = useState("BOTTOM" as AnchorPointName);
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
		<APIProvider apiKey={API_KEY} libraries={libraries}>
			<div className="h-[calc(100vh_-_108px)]">
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
									anchorPoint={AdvancedMarkerAnchorPoint[anchorPoint]}
									className="custom-marker"
									style={{
										transform: `scale(${
											[hoverId, selectedId].includes(id) ? 1.4 : 1
										})`
									}}
									onMarkerClick={(
										marker: google.maps.marker.AdvancedMarkerElement
									) => onMarkerClick(id, marker)}
									onMouseEnter={() => onMouseEnter(id)}
									onMouseLeave={onMouseLeave}
								>
									<div className="transition ease-in-out border-2 border-primary-foreground rounded-lg">
										<img
											src={content.photos[0]}
											alt={content.name || id}
											className="w-[40px] h-[40px] object-cover rounded-lg"
										/>
									</div>
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
							<p>Some arbitrary html to be rendered into the InfoWindow.</p>
						</InfoWindow>
					)}
				</Map>
			</div>
		</APIProvider>
	);

	function getMarkers(trip: TripModel) {
		const data: MarkerData = [];

		trip.places
			.sort((a, b) => (b.lat ?? 0) - (a.lat ?? 0))
			.forEach((place, index) => {
				if (!place.lat || !place.lng) return;

				data.push({
					id: place.id,
					position: { lat: place.lat, lng: place.lng },
					zIndex: index,
					content: place
				});
			});

		const selectedZIdx = data.length;
		const hoverZIdx = data.length + 1;

		const totalPoints = data.length;
		const center = totalPoints
			? {
					lat:
						data.reduce((sum, marker) => sum + marker.position.lat, 0) /
						totalPoints,
					lng:
						data.reduce((sum, marker) => sum + marker.position.lng, 0) /
						totalPoints
			  }
			: ({
					lat: trip.location.lat,
					lng: trip.location.lng
			  } as google.maps.LatLngLiteral);

		return { data, selectedZIdx, hoverZIdx, center };
	}
};

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

export default Playground;

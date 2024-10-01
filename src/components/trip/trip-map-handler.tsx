import { useMap } from "@vis.gl/react-google-maps";
import React, { useEffect } from "react";

interface TripMapHandlerProps {
	place: google.maps.places.PlaceResult | null;
}

const TripMapHandler = ({ place }: TripMapHandlerProps) => {
	const map = useMap();

	useEffect(() => {
		if (!map || !place) return;

		if (place.geometry?.viewport) {
			map.fitBounds(place.geometry?.viewport);
		}
	}, [map, place]);

	return null;
};

export default React.memo(TripMapHandler);

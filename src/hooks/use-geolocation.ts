import { useEffect, useState } from "react";

export const useGeolocation = () => {
	const [coordinates, setCoordinates] = useState<{
		lat: number;
		lng: number;
	}>({ lat: 1.3521, lng: 103.8198 });

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setCoordinates({
					lat: position.coords.latitude,
					lng: position.coords.longitude
				});
			},
			(error) => {
				console.error("Error getting location:", error);
			}
		);
	}, []);

	return coordinates;
};

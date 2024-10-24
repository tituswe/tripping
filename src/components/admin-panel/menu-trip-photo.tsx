"use client";

import { Image } from "lucide-react";
import { useEffect, useState } from "react";

interface MenuTripPhotoProps {
	placeId: string;
}

export function MenuTripPhoto({ placeId }: MenuTripPhotoProps) {
	const [photoUrl, setPhotoUrl] = useState<string | null>(null);

	useEffect(() => {
		fetchPlacePhoto(placeId).then((url) => {
			if (url) {
				setPhotoUrl(url);
			}
		});
	}, [placeId]);

	return (
		<div>
			{photoUrl ? (
				<img
					src={photoUrl}
					alt={photoUrl}
					className="w-10 h-10 flex-shrink-0 rounded-md transition group-hover:shadow-md"
				/>
			) : (
				<div className="w-10 h-10 flex-shrink-0 rounded-md bg-gray-200 flex items-center justify-center transition group-hover:shadow-md">
					<Image className="w-6 h-6 text-secondary" />
				</div>
			)}
		</div>
	);

	async function fetchPlacePhoto(placeId: string): Promise<string | null> {
		const res = await fetch(`/api/google-photo?placeId=${placeId}`);
		const data = await res.json();

		if (res.ok) {
			return data.photoUrl;
		} else {
			console.error("Error fetching photo:", data.error);
			return null;
		}
	}
}

"use client";

import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface MenuTripPhotoProps {
	placeId: string;
	width?: number;
	height?: number;
}

export function GooglePhoto({ placeId, width, height }: MenuTripPhotoProps) {
	const [photoUrl, setPhotoUrl] = useState<string | null>(null);

	useEffect(() => {
		fetchPlacePhoto(placeId).then((url) => {
			if (url) {
				setPhotoUrl(url);
			}
		});
	}, [placeId]);

	if (!width) width = 40;
	if (!height) height = 40;

	return (
		<div className="flex-shrink-0">
			{photoUrl ? (
				<Image
					src={photoUrl}
					alt={photoUrl}
					width={width}
					height={height}
					className={`w-[${width}px] h-[${height}px] object-cover aspect-square flex-shrink-0 rounded-md transition group-hover:shadow-md`}
				/>
			) : (
				<div
					className={`w-[${width}px] h-[${width}px] flex-shrink-0 rounded-md bg-gray-200 flex items-center justify-center transition group-hover:shadow-md`}
				>
					<ImageIcon className="w-6 h-6 text-secondary" />
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

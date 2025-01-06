"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface MenuTripPhotoProps {
	placeId: string;
	width?: number;
	height?: number;
	className?: string;
}

export function GooglePhoto({
	placeId,
	width,
	height,
	className
}: MenuTripPhotoProps) {
	const [photoUrl, setPhotoUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true); // Add loading state

	useEffect(() => {
		setLoading(true); // Set loading to true when fetching starts
		fetchPlacePhoto(placeId).then((url) => {
			if (url) {
				setPhotoUrl(url);
			}
			setLoading(false); // Set loading to false when fetching ends
		});
	}, [placeId]);

	if (!width) width = 40;
	if (!height) height = 40;

	return (
		<div className={`flex-shrink-0`}>
			{loading ? (
				<Skeleton className={`w-[${width}px] h-[${height}px]`} /> // Render Skeleton while loading
			) : photoUrl ? (
				<Image
					src={photoUrl}
					alt={photoUrl}
					width={width}
					height={height}
					className={className}
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
		const cachedPhotoUrl = sessionStorage.getItem(`photoUrl_${placeId}`);
		if (cachedPhotoUrl) {
			return cachedPhotoUrl;
		}

		const res = await fetch(`/api/google-photo?placeId=${placeId}`);
		const data = await res.json();

		if (res.ok) {
			sessionStorage.setItem(`photoUrl_${placeId}`, data.photoUrl);
			return data.photoUrl;
		} else {
			console.error("Error fetching photo:", data.error);
			return null;
		}
	}
}

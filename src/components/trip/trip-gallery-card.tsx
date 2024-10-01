"use client";

import Image from "next/image";

import { deletePlace } from "@/actions/actions";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { PlaceModel } from "@/lib/types";
import { shortNumber, snakeToNormalCase } from "@/lib/utils";
import { Copy, Delete, GripVertical, Star } from "lucide-react";
import { Button } from "../ui/button";

interface TripGalleryCardProps {
	place: PlaceModel;
}

export function TripGalleryCard({ place }: TripGalleryCardProps) {
	const { toast } = useToast();
	const recentReview = place.reviews[0];

	const handleCopy = () => {
		if (!place.formattedAddress) return;

		navigator.clipboard
			.writeText(place.formattedAddress)
			.then(() => {
				toast({
					title: "Address copied!"
				});
			})
			.catch((err) => {
				console.error("Failed to copy address: ", err);
			});
	};

	const handleDelete = async () => {
		await deletePlace(place.id);
	};

	return (
		<div className="flex flex-row space-x-1">
			<Button variant="ghost" className="px-1 cursor-grab">
				<GripVertical className="w-4 h-4 text-muted-foreground" />
			</Button>
			<div className="flex flex-row w-full justify-between items-center p-3 rounded-md border">
				<div className="flex flex-col w-full mr-2">
					<div className="flex flex-row justify-between">
						<h3 className="font-semibold text-lg">{place.name}</h3>
						{place.rating && (
							<div className="flex flex-row gap-1 items-center text-xs text-muted-foreground">
								<Badge
									variant="outline"
									className="flex flex-row gap-1 items-center "
								>
									<Star className="h-3 w-3 text-primary" />
									<span>{place.rating}</span>
								</Badge>
								{place.userRatingsTotal && (
									<Badge variant="secondary" className="font-light">
										{shortNumber(place.userRatingsTotal)}
									</Badge>
								)}
							</div>
						)}
					</div>

					<button
						className="text-start flex items-center transition hover:bg-muted"
						onClick={handleCopy}
					>
						<div className="w-3 h-3 mr-2">
							<Copy className="w-3 h-3 text-muted-foreground" />
						</div>
						<p className="text-sm text-muted-foreground text-ellipsis overflow-hidden line-clamp-1">
							{place.formattedAddress}
						</p>
					</button>

					<p className=" text-xs italic text-muted-foreground gap-2 rounded my-3 min-h-[60px]">
						{recentReview?.text}
					</p>

					<div className="flex-grow" />

					<div className="flex flex-row space-x-2 mt-3 overflow-x-hidden">
						{place.tags.map((tag, index) => (
							<Badge key={index} className="truncate max-h-6">
								{snakeToNormalCase(tag)}
							</Badge>
						))}
					</div>
				</div>
				{place.photos[0] && (
					<div className="hidden lg:block w-[320px]">
						<Image
							src={place.photos[0]}
							alt={place.name || "place-image"}
							width={320}
							height={145}
							className="h-[145px] w-[320px] object-cover rounded-lg shadow-sm"
						/>
					</div>
				)}
			</div>
			<Button variant="ghost" className="px-1" onClick={handleDelete}>
				<Delete className="w-4 h-4 text-muted-foreground" />
			</Button>
		</div>
	);
}

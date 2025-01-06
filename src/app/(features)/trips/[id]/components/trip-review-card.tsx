"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarFilledIcon } from "@radix-ui/react-icons";

interface TripReviewCardProps {
	review: {
		id: string;
		placeId: string;
		rating: number | null;
		authorName: string | null;
		authorUrl: string | null;
		language: string | null;
		profilePhotoUrl: string | null;
		relativeTimeDescription: string | null;
		text: string | null;
		postedAt: Date | null;
	};
}

export function TripReviewCard({ review }: TripReviewCardProps) {
	return (
		<div className="p-1.5 pb-3 mb-3 border-b">
			<div className="flex space-x-3 items-center">
				<Avatar className="h-8 w-8">
					<AvatarImage src={review.profilePhotoUrl || ""} alt="Avatar" />
					<AvatarFallback className="bg-muted">
						{review.authorName?.charAt(0)}
					</AvatarFallback>
				</Avatar>
				<p className="text-sm">{review.authorName}</p>
			</div>
			<div className="flex flex-row items-center mt-1.5">
				{Array.from({ length: Math.floor(review.rating || 0) }).map(
					(_, index) => (
						<StarFilledIcon key={index} className="w-4 h-4 text-yellow-400" />
					)
				)}
				<p className="text-xs ml-2">{review.rating || "No rating"}</p>
			</div>
			<p className="mt-3 text-xs font-light">{review.text}</p>
		</div>
	);
}

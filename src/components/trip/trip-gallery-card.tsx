"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { Copy, GripVertical, Star, Trash2 } from "lucide-react";
import Image from "next/image";

import { deletePlace } from "@/actions/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import { useHandleCopy } from "@/hooks/use-handle-copy";
import { shortNumber, snakeToNormalCase } from "@/lib/utils";
import { DndCard, DndCardDragData } from "./types";

interface TripGalleryCardProps {
	card: DndCard;
}

export function TripGalleryCard({ card }: TripGalleryCardProps) {
	const place = card.content;
	const recentReview = place.reviews[0];

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({
		id: card.id,
		data: {
			type: "Card",
			task: card
		} satisfies DndCardDragData,
		attributes: {
			roleDescription: "Card"
		}
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	const { handleCopy } = useHandleCopy(
		place.formattedAddress,
		"Address copied!"
	);

	const handleDelete = async () => {
		await deletePlace(place.id);
	};

	return (
		<div ref={setNodeRef} style={style} className="flex flex-row space-x-1">
			<div className="flex flex-col">
				<Button
					variant="ghost"
					size="sm"
					className="px-1 cursor-grab"
					{...attributes}
					{...listeners}
				>
					<GripVertical className="w-4 h-4 text-muted-foreground" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="px-1 text-muted-foreground transition hover:text-destructive"
					onClick={handleDelete}
				>
					<Trash2 className="w-4 h-4" />
				</Button>
			</div>
			<div
				className={`flex flex-row w-full justify-between items-center p-3 rounded-md bg-muted border-0 ${
					isDragging && "z-50 bg-primary-foreground ring-2 ring-primary"
				}`}
			>
				<div className="flex flex-col w-full mr-2">
					<div className="flex flex-row justify-between">
						<h3 className="font-semibold text-md text-ellipsis overflow-hidden line-clamp-1">
							{place.name}
						</h3>
						{place.rating && (
							<div className="flex flex-row gap-1 items-center text-xs text-muted-foreground">
								<Badge
									variant="outline"
									className="flex flex-row gap-1 items-center"
								>
									<Star className="h-3 w-3 text-primary" />
									<span>{place.rating}</span>
								</Badge>
								{place.userRatingsTotal && (
									<Badge
										variant="secondary"
										className="font-light text-muted-foreground px-1"
									>
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
						<p className="text-xs text-muted-foreground text-ellipsis overflow-hidden line-clamp-1">
							{place.formattedAddress}
						</p>
					</button>

					{recentReview ? (
						<Dialog>
							<DialogTrigger>
								<p className="text-start text-xs italic text-muted-foreground gap-2 rounded mt-3 mb-6 h-[45px] overflow-y-hidden line-clamp-3 transition hover:bg-muted cursor-pointer">
									{recentReview.text}
								</p>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Review by {recentReview.authorName}</DialogTitle>
									<DialogDescription className="pt-3 pb-1 italic">
										{recentReview.text}
									</DialogDescription>
									{recentReview.postedAt && (
										<DialogFooter className="text-sm text-secondary-foreground">
											~ {format(recentReview.postedAt, "PPP")}
										</DialogFooter>
									)}
								</DialogHeader>
							</DialogContent>
						</Dialog>
					) : (
						<div className="h-[45px] mt-3 mb-6" />
					)}

					<div className="flex-grow" />

					{place.tags.length > 0 && (
						<div>
							<Badge className="truncate max-h-6">
								{snakeToNormalCase(place.tags[0])}
							</Badge>
						</div>
					)}
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
		</div>
	);
}

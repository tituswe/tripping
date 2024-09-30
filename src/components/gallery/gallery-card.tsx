"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn, currencyFormatter } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { Copy, ImagePlus, MapPin } from "lucide-react";
import { Item, ItemDragData } from "../kanban-board/types";

interface GalleryCardProps {
	item: Item;
	isOverlay?: boolean;
}

export function GalleryCard({ item, isOverlay }: GalleryCardProps) {
	const { toast } = useToast();

	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging
	} = useSortable({
		id: item.id,
		data: {
			type: "Item",
			item: item
		} satisfies ItemDragData,
		attributes: {
			roleDescription: "Item"
		}
	});

	const style = {
		transition,
		transform: CSS.Translate.toString(transform)
	};

	const variants = cva("", {
		variants: {
			dragging: {
				over: "ring-2 opacity-30",
				overlay: "ring-2 ring-primary"
			}
		}
	});

	return (
		<Card
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className={cn(
				"flex flex-col cursor-grab border-[3px] transition hover:border-primary",
				variants({
					dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined
				})
			)}
		>
			<CardHeader className="p-0 rounded-lg">
				{item.content.media[0] ? (
					<Image
						src={item.content.media[0]}
						alt="Project"
						width="400"
						height="225"
						className="aspect-video object-cover rounded-lg"
					/>
				) : (
					<div className="aspect-video object-cover rounded-lg bg-muted flex justify-center items-center">
						<ImagePlus className="w-6 h-6" />
					</div>
				)}
			</CardHeader>
			<CardContent className="p-4 space-y-1 flex-grow rounded-lg">
				<div className="flex flex-col justify-between h-full">
					<div className="flex flex-col justify-between">
						<span className="text-lg font-semibold">{item.content.name}</span>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<div className="text-start flex flex-row rounded-md space-x-0.5 pt-0.5">
										<MapPin className="w-4 h-4 inline-block" />
										<span
											className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer transition hover:bg-secondary rounded-md py-1/2 px-1.5"
											onClick={() => {
												navigator.clipboard.writeText(item.content.address);
												toast({
													title: "Address copied!"
												});
											}}
										>
											{item.content.address}{" "}
											<Copy className="w-3 h-3 inline-block ml-1" />
										</span>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>Copy to clipboard</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
					<div className="flex justify-between mt-3">
						<Badge>{item.content.activity}</Badge>
						<Badge variant="outline">
							{currencyFormatter.format(item.content.price)}
						</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

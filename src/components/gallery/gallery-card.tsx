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
import { currencyFormatter } from "@/lib/utils";
import { TripItem } from "@prisma/client";
import { Copy, ImagePlus, MapPin } from "lucide-react";

interface GalleryCardProps {
	item: TripItem;
}

export function GalleryCard({ item }: GalleryCardProps) {
	const { toast } = useToast();

	return (
		<Card className="flex flex-col cursor-pointer border-[3px] transition hover:border-primary">
			<CardHeader className="p-0 rounded-lg">
				{item.media[0] ? (
					<Image
						src={item.media[0]}
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
						<span className="text-lg font-semibold">{item.name}</span>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<div
										className="text-start flex flex-row space-x-2 cursor-pointer rounded-md transition hover:bg-secondary"
										onClick={() => {
											navigator.clipboard.writeText(item.address);
											toast({
												title: "Address copied!"
											});
										}}
									>
										<MapPin className="w-4 h-4 inline-block" />
										<span className="text-xs text-gray-500 dark:text-gray-400">
											{item.address}{" "}
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
					<div className="flex justify-between mt-2">
						<Badge>{item.activity}</Badge>
						<Badge variant="outline">
							{currencyFormatter.format(item.price)}
						</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

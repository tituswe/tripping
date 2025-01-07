"use client";

import { TripModel } from "@/lib/types";
import { format } from "date-fns";
import { Ellipsis, MapPin, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { deleteTrip } from "@/actions/actions";
import { GooglePhoto } from "@/components/admin-panel/google-photo";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface DashboardTripCardProps {
	trip: TripModel;
}

export function DashboardTripCard({ trip }: DashboardTripCardProps) {
	const { toast } = useToast();
	const router = useRouter();
	const [photoUrl, setPhotoUrl] = useState<string | null>(null);
	const { data: session } = useSession();

	useEffect(() => {
		fetchPlacePhoto(trip.location.placeId).then((url) => {
			if (url) {
				setPhotoUrl(url);
			}
		});
	}, [trip.location.placeId]);

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const handleDeleteClick = () => {
		setIsDropdownOpen(false);
		setTimeout(() => {
			setIsDeleteDialogOpen(true);
		}, 0);
	};

	const handleConfirmDelete = async () => {
		try {
			await deleteTrip(trip.id);
			router.push(`/dashboard`);
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.message || "There was an error deleting your trip.",
				variant: "destructive"
			});
		}
	};

	return (
		<Link
			href={`/trips/${trip.id}`}
			className="relative flex cursor-pointer rounded-lg group"
		>
			<GooglePhoto
				placeId={trip.location.placeId}
				className="w-[80px] h-[80px] aspect-square rounded-lg"
			/>
			<div className="flex flex-row items-center ml-4 flex-grow">
				<div className="mt-2">
					<span className="text-md font-medium line-clamp-1 text-ellipsis">
						{trip.title || `Trip to ${trip.location.name}`}
					</span>
					<div className="flex flex-col space-y-3 text-xs font-light text-muted-foreground truncate line-clamp-1 text-ellipsis">
						{trip.places.length > 0 && (
							<div className="flex items-center">
								<MapPin className="mr-0.5 h-3 w-3 flex-shrink-0" />
								<p>
									{trip.places.length <= 99 ? trip.places.length : "99+"} places
								</p>
							</div>
						)}
						{trip.places.length <= 0 && <p>No places added</p>}
						{trip.from && trip.to && (
							<p className="font-medium">
								{format(trip.from, "MMM dd, yyyy")} -{" "}
								{format(trip.to, "MMM dd, yyyy")}
							</p>
						)}
					</div>
				</div>
				<Avatar className="absolute right-1.5 bottom-1.5 h-6 w-6 outline outline-1 outline-muted-foreground">
					<AvatarImage src={trip.creator.image || ""} alt="Avatar" />
					<AvatarFallback className="bg-muted text-xs">
						{trip.creator.name?.charAt(0)}
					</AvatarFallback>
				</Avatar>
			</div>

			<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
				<DropdownMenuTrigger asChild>
					<Button
						variant={"secondary"}
						size="xs"
						className="absolute right-1.5 top-1.5 rounded-full"
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						<Ellipsis className="w-3 h-3" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					{session?.user?.email === trip.creator.email && (
						<DropdownMenuItem
							className="text-destructive cursor-pointer"
							onSelect={handleDeleteClick}
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							trip from our databases.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={(e) => {
								e.stopPropagation();
							}}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e) => {
								e.stopPropagation();
								handleConfirmDelete();
							}}
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Link>
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

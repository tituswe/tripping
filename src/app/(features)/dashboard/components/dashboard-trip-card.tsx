"use client";

import { TripModel } from "@/lib/types";
import { format } from "date-fns";
import { Dot, Ellipsis, MapPin, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { deleteTrip } from "@/actions/actions";
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
		<div
			className="relative flex flex-col cursor-pointer rounded-lg group"
			onClick={() => router.push(`/trips/${trip.id}`)}
		>
			<div className="w-full h-full aspect-square overflow-hidden rounded-lg">
				{photoUrl ? (
					<img
						src={photoUrl}
						alt={"place-image"}
						className="w-full h-full object-cover rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rounded-lg"
					/>
				) : (
					<div className="bg-muted w-full h-full rounded-lg shadow-sm" />
				)}
			</div>
			<div className="flex flex-row items-center">
				<div className="mt-2">
					<span className="text-sm font-medium line-clamp-1 text-ellipsis">
						{trip.title || `Trip to ${trip.location.name}`}
					</span>
					<div className="flex items-center text-xs font-light text-muted-foreground truncate line-clamp-1 text-ellipsis">
						{trip.from && <p>{format(trip.from, "MMM dd, yyyy")}</p>}
						{trip.from && <Dot className="h-4 w-4 flex-shrink-0" />}
						{trip.places.length > 0 && (
							<div className="flex items-center">
								<MapPin className="mr-0.5 h-3 w-3 flex-shrink-0" />
								<p>{trip.places.length <= 99 ? trip.places.length : "99+"}</p>
							</div>
						)}
						{trip.places.length <= 0 && <p>No places added</p>}
						<Dot className="h-4 w-4 flex-shrink-0" />
						<div className="flex items-center">
							<User className="mr-0.5 h-3 w-3 flex-shrink-0" />
							<p>{trip.invited.length <= 8 ? trip.invited.length + 1 : "9+"}</p>
						</div>
					</div>
				</div>
				<Avatar className="translate-y-1 ml-auto h-6 w-6 outline outline-1 outline-muted-foreground">
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
					{session?.user?.id === trip.creatorId && (
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

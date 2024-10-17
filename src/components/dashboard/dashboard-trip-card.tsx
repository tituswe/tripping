"use client";

import { TripModel } from "@/lib/types";
import { format } from "date-fns";
import { Dot, Ellipsis, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface DashboardTripCardProps {
	trip: TripModel;
}

export function DashboardTripCard({ trip }: DashboardTripCardProps) {
	const { toast } = useToast();
	const router = useRouter();
	const imageUrl = trip.location.photos[0] || "";

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
				{imageUrl ? (
					<img
						src={imageUrl}
						alt={"place-image"}
						className="w-full h-full object-cover rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rounded-lg"
					/>
				) : (
					<div className="bg-muted w-full h-full rounded-lg shadow-sm" />
				)}
			</div>
			<div className="mt-2">
				<span className="text-sm font-medium line-clamp-1 text-ellipsis">
					{trip.title || `Trip to ${trip.location.name}`}
				</span>
				<div className="flex items-center text-xs font-light text-muted-foreground truncate line-clamp-1 text-ellipsis">
					{trip.from && <p>{format(trip.from, "MMM dd, yyyy")}</p>}
					{trip.from && <Dot className="h-4 w-4 flex-shrink-0" />}
					{trip.places.length > 0 && <p>{trip.places.length} Places</p>}
					{trip.places.length <= 0 && <p>No places added</p>}
				</div>
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
					<DropdownMenuItem
						className="text-destructive cursor-pointer"
						onSelect={handleDeleteClick}
					>
						<Trash2 className="mr-2 h-4 w-4" />
						Delete
					</DropdownMenuItem>
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
}

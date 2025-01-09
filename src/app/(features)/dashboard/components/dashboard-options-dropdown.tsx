"use client";

import { deleteTrip, leaveTrip } from "@/actions/actions";
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
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { TripModel } from "@/lib/types";
import { ArrowLeftCircle, Ellipsis, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DashboardOptionsDropdownProps {
	trip: TripModel;
	className?: string;
}

export function DashboardOptionsDropdown({
	trip,
	className
}: DashboardOptionsDropdownProps) {
	const { data: session } = useSession();
	const router = useRouter();
	const { toast } = useToast();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const handleLeaveClick = async () => {
		try {
			await leaveTrip(trip.id);
			router.push(`/dashboard`);
			toast({
				title: "Leaving trip",
				description: "You have left the trip."
			});
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.message || "There was an error leaving the trip.",
				variant: "destructive"
			});
		}
	};

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
			toast({
				title: "Deleting trip",
				description: "You have deleted the trip."
			});
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.message || "There was an error deleting your trip.",
				variant: "destructive"
			});
		}
	};
	return (
		<>
			<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
				<DropdownMenuTrigger asChild>
					<Button
						variant={"secondary"}
						size="xs"
						className={`absolute right-1.5 top-1.5 rounded-full ${className}`}
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
					<DropdownMenuLabel>Options</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{trip.invited.some((user) => user.email === session?.user?.email) && (
						<DropdownMenuItem
							className="cursor-pointer"
							onSelect={handleLeaveClick}
						>
							<ArrowLeftCircle className="mr-2 h-4 w-4" />
							Leave trip
						</DropdownMenuItem>
					)}
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
		</>
	);
}

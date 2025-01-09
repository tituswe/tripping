"use client";

import { ArrowLeftCircle, Cog, Trash2 } from "lucide-react";
import { useState } from "react";

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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface TripSettingsProps {
	trip: TripModel;
}

export function TripSettings({ trip }: TripSettingsProps) {
	const router = useRouter();
	const { toast } = useToast();
	const { data: session } = useSession();
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);

	const handleLeaveClick = async () => {
		try {
			await leaveTrip(trip.id);
			router.push(`/dashboard`);
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.message || "There was an error leaving the trip.",
				variant: "destructive"
			});
		}
	};

	const handleDeleteClick = () => {
		setIsSettingsDropdownOpen(false);
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
		<>
			<DropdownMenu
				open={isSettingsDropdownOpen}
				onOpenChange={setIsSettingsDropdownOpen}
			>
				<DropdownMenuTrigger asChild>
					<Button size="icon" variant="ghost">
						<Cog className="h-4 w-4 text-muted-foreground" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel className="text-sm font-medium">
						Settings
					</DropdownMenuLabel>
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
							className="text-destructive cursor-pointer text-xs"
							onSelect={handleDeleteClick}
						>
							<p>Delete</p>
							<Trash2 className="ml-auto h-3 w-3" />
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
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirmDelete}>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

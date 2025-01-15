"use client";

import { removeUserFromTrip } from "@/actions/actions";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { TripModel, UserModel } from "@/lib/types";
import { X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface ManagePartyDialogProps {
	trip: TripModel;
	children: React.ReactNode;
}

export function ManagePartyDialog({ children, trip }: ManagePartyDialogProps) {
	const { toast } = useToast();
	const [open, setOpen] = useState(false);

	const targetUsers = [trip.creator, ...trip.invited];

	const sortedUsers = targetUsers.sort((a, b) => {
		if (a.id === trip.creator.id) return -1;
		if (b.id === trip.creator.id) return 1;
		const aIsInvited = trip.invited.some((user) => user.id === a.id);
		const bIsInvited = trip.invited.some((user) => user.id === b.id);
		if (aIsInvited && !bIsInvited) return -1;
		if (!aIsInvited && bIsInvited) return 1;
		return 0;
	});

	const handleRemoveUser = async (user: UserModel) => {
		try {
			await removeUserFromTrip(trip.id, user.id);
			toast({
				title: "User removed",
				description: `${user.name} has been removed from the trip.`
			});
		} catch (e: any) {
			toast({
				title: "Error",
				description: e.message
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<div onClick={() => setOpen(true)}>{children}</div>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Manage Party for &quot;
						{trip.title || `Your trip to ${trip.location.name}`}&quot;
					</DialogTitle>
					<DialogDescription>
						Manage your friends coming on this trip.
					</DialogDescription>
				</DialogHeader>
				<ul className="rounded-lg border">
					{sortedUsers.map((user, index) => (
						<li key={index} className="flex items-center px-3 py-2">
							<Avatar className="h-8 w-8 mr-3">
								<AvatarImage src={user.image || ""} alt="Avatar" />
								<AvatarFallback className="bg-muted text-xs">
									{user.name?.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<p className="text-sm translate-y-1">
									{user.name}
									<span className="text-muted-foreground">
										{index === 0 && " | Owner"}
									</span>
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									{user.email}
								</p>
							</div>
							<div className="ml-auto flex items-center space-x-3">
								{index === 0 ? null : (
									<>
										{/* Manage a user's roles in a trip */}
										{/* <Button
											size="icon"
											variant="secondaryGhost"
											className="rounded-full"
										>
											<Cog className="h-5 w-5" />
										</Button> */}
										<Button
											size="icon"
											variant="destructiveGhost"
											className="rounded-full"
											onClick={() => handleRemoveUser(user)}
										>
											<X className="h-5 w-5" />
										</Button>
									</>
								)}
							</div>
						</li>
					))}
				</ul>
				<div className="flex justify-end space-x-3">
					<Button
						variant="secondaryGhost"
						className="rounded-full"
						onClick={() => setOpen(false)}
					>
						Done
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

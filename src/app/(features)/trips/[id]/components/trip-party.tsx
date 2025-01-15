"use client";

import { Link, PartyPopper, UserCog } from "lucide-react";

import { InviteLinkDialog } from "@/components/custom-ui/invite-link-dialog";
import { ManagePartyDialog } from "@/components/custom-ui/manage-party-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import { TripModel } from "@/lib/types";
import { useState } from "react";

interface TripPartyProps {
	trip: TripModel;
}

export function TripParty({ trip }: TripPartyProps) {
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

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="ghost" className="flex flex-row -space-x-0.5 px-2">
					<Avatar className="h-6 w-6 outline outline-1 outline-muted">
						<AvatarImage src={trip.creator.image || ""} alt="Avatar" />
						<AvatarFallback className="bg-muted">
							{trip.creator.name?.charAt(0)}
						</AvatarFallback>
					</Avatar>
					{trip.invited.slice(0, 2).map((user) => (
						<Avatar
							key={user.id}
							className="h-6 w-6 outline outline-1 outline-muted"
						>
							<AvatarImage src={user.image || ""} alt="Avatar" />
							<AvatarFallback className="bg-muted">
								{user.name?.charAt(0)}
							</AvatarFallback>
						</Avatar>
					))}
					{trip.invited.length > 3 && (
						<div className="h-6 w-6 outline outline-1 outline-muted bg-muted-foreground text-primary-foreground text-xs rounded-full flex justify-center items-center font-light z-10">
							<p>+{trip.invited.length - 3}</p>
						</div>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[280px] p-0" align="end">
				<div>
					<div className="mx-3 pt-3">
						<div className="flex flex-row mb-0.5">
							<PartyPopper className="h-4 w-4 mr-1.5" />
							<p className="font-medium text-sm">Your party</p>
						</div>
						<p className="font-light text-xs text-muted-foreground">
							Search and add friends to this trip.
						</p>
					</div>
					<div className="flex justify-evenly py-3 border-b">
						<InviteLinkDialog trip={trip}>
							<Button
								size="sm"
								variant="outline"
								className="text-xs flex items-center justify-center"
							>
								<Link className="w-3 h-3 mr-1.5" />
								Share invite link
							</Button>
						</InviteLinkDialog>
						<ManagePartyDialog trip={trip}>
							<Button
								size="sm"
								variant="outline"
								className="text-xs flex items-center justify-center"
							>
								<UserCog className="w-3 h-3 mr-1.5" />
								Manage party
							</Button>
						</ManagePartyDialog>
					</div>
					<ul>
						{sortedUsers.map((user, index) => (
							<li key={index} className="flex items-center px-3 py-1.5">
								<Avatar className="h-6 w-6 mr-3">
									<AvatarImage src={user.image || ""} alt="Avatar" />
									<AvatarFallback className="bg-muted text-xs">
										{user.name?.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<p className="text-xs translate-y-1">{user.name}</p>
									<p className="text-xs text-muted-foreground mt-1">
										{user.email}
									</p>
								</div>
							</li>
						))}
					</ul>
				</div>
			</PopoverContent>
		</Popover>
	);
}

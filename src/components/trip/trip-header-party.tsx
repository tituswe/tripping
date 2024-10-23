"use client";

import { Check, PartyPopper, Search } from "lucide-react";

import { addUserToTrip, removeUserFromTrip } from "@/actions/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import { UserModel } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Input } from "../ui/input";

interface TripHeaderPartyProps {
	tripId: string;
	creator: UserModel;
	invited: UserModel[];
	users: UserModel[];
}

export function TripHeaderParty({
	tripId,
	creator,
	invited,
	users
}: TripHeaderPartyProps) {
	const { data: session } = useSession();
	const [open, setOpen] = useState(false);
	const [filter, setFilter] = useState("");

	const invitedIds = [creator.id, ...invited.map((user) => user.id)];

	const handleSelect = async (userId: string) => {
		if (userId === session?.user?.id) return;
		if (userId === creator.id) return;

		if (invitedIds.includes(userId)) {
			await removeUserFromTrip(tripId, userId);
		} else {
			await addUserToTrip(tripId, userId);
		}
	};

	const targetUsers = filter ? users : [creator, ...invited];

	const sortedUsers = targetUsers.sort((a, b) => {
		if (a.id === creator.id) return -1;
		if (b.id === creator.id) return 1;
		const aIsInvited = invited.some((user) => user.id === a.id);
		const bIsInvited = invited.some((user) => user.id === b.id);
		if (aIsInvited && !bIsInvited) return -1;
		if (!aIsInvited && bIsInvited) return 1;
		return 0;
	});

	const filteredUsers = sortedUsers
		.filter(
			(user) =>
				user.name?.toLowerCase().includes(filter.toLowerCase()) ||
				user.email.toLowerCase().includes(filter.toLowerCase())
		)
		.slice(0, 7);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="ghost" className="flex flex-row -space-x-0.5">
					<Avatar className="h-7 w-7 outline outline-1 outline-primary">
						<AvatarImage src={creator.image || ""} alt="Avatar" />
						<AvatarFallback className="bg-muted">
							{creator.name?.charAt(0)}
						</AvatarFallback>
					</Avatar>
					{invited.map((user) => (
						<Avatar
							key={user.id}
							className="h-7 w-7 outline outline-1 outline-primary"
						>
							<AvatarImage src={user.image || ""} alt="Avatar" />
							<AvatarFallback className="bg-muted">
								{user.name?.charAt(0)}
							</AvatarFallback>
						</Avatar>
					))}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[280px] p-0" align="end">
				<Command>
					<div className="mx-3 my-2">
						<div className="flex flex-row mb-0.5">
							<PartyPopper className="h-4 w-4 mr-1.5" />
							<p className="font-semibold text-sm">Your party</p>
						</div>
						<p className="font-light text-xs text-muted-foreground">
							Search and add friends to this trip.
						</p>
					</div>
					<div className="relative">
						<Search className="absolute h-4 w-4 text-muted-foreground top-2.5 left-2.5" />
						<Input
							className="pl-8 focus-visible:outline-none focus-visible:ring-0 shadow-none border-t-1 border-b-1 border-r-0 border-l-0 rounded-none"
							placeholder="Add friend..."
							value={filter}
							onInputCapture={(e: React.ChangeEvent<HTMLInputElement>) =>
								setFilter(e.target.value)
							}
						/>
					</div>
					<CommandList>
						{filteredUsers.length === 0 ? (
							<CommandEmpty>
								<p className="text-muted-foreground">No users found</p>
							</CommandEmpty>
						) : (
							<CommandGroup>
								{filteredUsers.map((user, index) => (
									<CommandItem
										key={index}
										value={user.id}
										onSelect={() => handleSelect(user.id)}
										className={`px-3 ${
											user.id === session?.user?.id || user.id === creator.id
												? "bg-muted"
												: "cursor-pointer"
										}`}
									>
										<Avatar className="h-6 w-6 outline outline-primary mr-3">
											<AvatarImage src={user.image || ""} alt="Avatar" />
											<AvatarFallback className="bg-transparent">
												{user.name?.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div className="flex flex-col">
											<p>{user.name}</p>
											<p className="text-xs text-muted-foreground">
												{user.email}
											</p>
										</div>
										<Check
											className={cn(
												"ml-auto h-4 w-4",
												invitedIds.includes(user.id)
													? "opacity-100"
													: "opacity-0"
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

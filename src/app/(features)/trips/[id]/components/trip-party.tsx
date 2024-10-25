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
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import { TripModel, UserModel } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface TripPartyProps {
	users: UserModel[];
	trip: TripModel;
}

export function TripParty({ users, trip }: TripPartyProps) {
	const { data: session } = useSession();
	const [open, setOpen] = useState(false);
	const [filter, setFilter] = useState("");

	const invitedIds = [trip.creator.id, ...trip.invited.map((user) => user.id)];

	const handleSelect = async (userId: string) => {
		if (userId === session?.user?.id) return;
		if (userId === trip.creator.id) return;

		if (invitedIds.includes(userId)) {
			await removeUserFromTrip(trip.id, userId);
		} else {
			await addUserToTrip(trip.id, userId);
		}
	};

	const targetUsers = filter ? users : [trip.creator, ...trip.invited];

	const sortedUsers = targetUsers.sort((a, b) => {
		if (a.id === trip.creator.id) return -1;
		if (b.id === trip.creator.id) return 1;
		const aIsInvited = trip.invited.some((user) => user.id === a.id);
		const bIsInvited = trip.invited.some((user) => user.id === b.id);
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
				<Command>
					<div className="mx-3 my-2">
						<div className="flex flex-row mb-0.5">
							<PartyPopper className="h-3.5 w-3.5 mr-1.5" />
							<p className="font-medium text-xs">Your party</p>
						</div>
						<p className="font-light text-2xs text-muted-foreground">
							Search and add friends to this trip.
						</p>
					</div>
					<div className="relative">
						<Search className="absolute h-3 w-3 text-muted-foreground top-3 left-3" />
						<Input
							className="pl-8 text-xs focus-visible:outline-none focus-visible:ring-0 shadow-none border-t-1 border-b-1 border-r-0 border-l-0 rounded-none"
							placeholder="Add friend..."
							value={filter}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
											user.id === session?.user?.id ||
											user.id === trip.creator.id
												? "bg-muted"
												: "cursor-pointer"
										}`}
									>
										<Avatar className="h-6 w-6 outline outline-1 outline-primary mr-3">
											<AvatarImage src={user.image || ""} alt="Avatar" />
											<AvatarFallback className="bg-transparent text-xs">
												{user.name?.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div className="flex flex-col">
											<p className="text-xs translate-y-1">{user.name}</p>
											<p className="text-2xs text-muted-foreground">
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

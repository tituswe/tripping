"use client";

import { CalendarDays, Cog, Plane, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DateRange } from "react-day-picker";

import { deleteTrip, updateTrip } from "@/actions/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Calendar } from "@/components/ui/calendar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { TripModel, UserModel } from "@/lib/types";
import { format } from "date-fns";
import { TripHeaderParty } from "./trip-header-party";

interface TripHeaderProps {
	users: UserModel[];
	trip: TripModel;
}

export function TripHeader({ users, trip }: TripHeaderProps) {
	const router = useRouter();
	const { toast } = useToast();

	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: trip.from || undefined,
		to: trip.to || undefined
	});
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [title, setTitle] = useState(trip.location.name);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);

	const onCloseAutoFocus = async () => {
		await updateTrip(trip.id, {
			from: dateRange?.from,
			to: dateRange?.to
		}).then(() => {
			window.location.reload();
		});
	};

	const handleTitleClick = () => {
		setIsEditingTitle(true);
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const handleTitleBlur = async () => {
		setIsEditingTitle(false);
		await updateTrip(trip.id, { title });
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
			<img
				src={trip.location.photos[0]}
				height={200}
				width={1000}
				alt={trip.location.name || "background-image"}
				className="w-full h-[200px] object-cover"
			/>
			<Alert className="rounded-none border-t-0 border-l-0 border-r-0">
				<Plane className="h-6 w-6 mt-1.5" />
				<AlertTitle className="ml-2 font-semibold text-2xl mt-1 flex items-center justify-between">
					{isEditingTitle ? (
						<input
							type="text"
							value={title || ""}
							onChange={handleTitleChange}
							onBlur={handleTitleBlur}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.currentTarget.blur();
								}
							}}
							className="px-1 font-semibold text-2xl mt-1 focus:outline-muted"
							autoFocus
						/>
					) : (
						<span
							className="px-1 rounded cursor-pointer transition hover:bg-muted"
							onClick={handleTitleClick}
						>
							{trip.title || `Your trip to ${trip.location.name}`}
						</span>
					)}
					<div className="flex flex-row space-x-1 items-center">
						<TripHeaderParty
							tripId={trip.id}
							creator={trip.creator}
							invited={trip.invited}
							users={users}
						/>
						<DropdownMenu
							open={isSettingsDropdownOpen}
							onOpenChange={setIsSettingsDropdownOpen}
						>
							<DropdownMenuTrigger asChild>
								<Button variant={"ghost"}>
									<Cog className="h-5 w-5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Settings</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-destructive cursor-pointer"
									onSelect={handleDeleteClick}
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</AlertTitle>
				<AlertDescription className="ml-2 space-x-2">
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="ghost"
								className="text-muted-foreground transition hover:text-primary cursor-pointer pl-3"
							>
								<CalendarDays className="mr-2 h-4 w-4" />
								{trip.from && trip.to ? (
									<span className="flex space-x-1 border-l pl-2">
										<span className="hidden md:block">Gone from</span>
										<b className="hidden md:block">
											{format(trip.from, "PPP")}
										</b>
										<b className="md:hidden">
											{format(trip.from, "MMM d, yyyy")}
										</b>
										<span>to</span>
										<b className="hidden md:block">{format(trip.to, "PPP")}</b>
										<b className="md:hidden">
											{format(trip.to, "MMM d, yyyy")}
										</b>
									</span>
								) : (
									<span className="border-l pl-2 mr-[472px]">Add dates</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent
							className="w-full p-0"
							align="start"
							onCloseAutoFocus={onCloseAutoFocus}
						>
							<Calendar
								initialFocus
								mode="range"
								defaultMonth={dateRange?.from}
								selected={dateRange}
								onSelect={setDateRange}
								numberOfMonths={2}
							/>
						</PopoverContent>
					</Popover>
				</AlertDescription>
			</Alert>

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

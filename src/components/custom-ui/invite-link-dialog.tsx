"use client";

import { createTripInvite } from "@/actions/actions";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { TripModel } from "@/lib/types";
import { Link } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface InviteLinkDialogProps {
	trip: TripModel;
	children: React.ReactNode;
}

export function InviteLinkDialog({ children, trip }: InviteLinkDialogProps) {
	const { toast } = useToast();
	const [open, setOpen] = useState(false);

	const handleCopy = async () => {
		try {
			const invite = await createTripInvite(trip.id);
			const inviteLink = `${window.location.origin}/invites/${invite.id}`;

			navigator.clipboard.writeText(inviteLink);
			toast({
				title: "Copied link",
				description: "Share link to friends to invite them to the trip."
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
						Send the invite link for &quot;
						{trip.title || `Your trip to ${trip.location.name}`}&quot;
					</DialogTitle>
					<DialogDescription>
						Copy the link to allow others to join your trip. The link will be
						valid for 7 days.
					</DialogDescription>
				</DialogHeader>
				<div className="flex justify-end space-x-3">
					<Button
						variant="destructiveGhost"
						className="rounded-full"
						onClick={() => setOpen(false)}
					>
						Cancel
					</Button>
					<Button className="rounded-full" onClick={handleCopy}>
						<Link className="w-5 h-5 mr-2" />
						Copy link
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

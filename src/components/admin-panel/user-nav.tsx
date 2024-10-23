"use client";

import { LayoutGrid, LogOut, User } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/components/ui/tooltip";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function UserNav() {
	const router = useRouter();
	const { data: session } = useSession();

	if (!session?.user) {
		return (
			<Button
				variant="outline"
				size="sm"
				className="ml-1"
				onClick={() => router.push("/sign-in")}
			>
				Sign in
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<TooltipProvider disableHoverableContent>
				<Tooltip delayDuration={100}>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="relative h-8 w-8 rounded-full"
							>
								<Avatar className="h-8 w-8">
									<AvatarImage src={session?.user?.image || ""} alt="Avatar" />
									<AvatarFallback className="bg-transparent">
										{session?.user?.name?.charAt(0)}
									</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent side="bottom">Profile</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<DropdownMenuContent className="w-72" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-row items-center space-x-3 m-1.5">
						<Avatar className="h-10 w-10">
							<AvatarImage src={session?.user?.image || ""} alt="Avatar" />
							<AvatarFallback className="bg-transparent">
								{session?.user?.name?.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">
								{session?.user?.name}
							</p>
							<p className="text-xs leading-none text-muted-foreground">
								{session?.user?.email}
							</p>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem className="hover:cursor-pointer" asChild>
						<Link href="/dashboard" className="flex items-center">
							<LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
							Dashboard
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem className="hover:cursor-pointer" asChild>
						<Link href="/account" className="flex items-center">
							<User className="w-4 h-4 mr-3 text-muted-foreground" />
							Account
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="hover:cursor-pointer"
					onClick={() => signOut()}
				>
					<LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

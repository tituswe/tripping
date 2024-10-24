"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Icons } from "../icons";

interface GoogleSignInButtonProps {
	isLoading: boolean;
}

export function GoogleSignInButton({ isLoading }: GoogleSignInButtonProps) {
	const handleClick = () => {
		signIn("google");
	};

	return (
		<Button
			variant="outline"
			type="button"
			disabled={isLoading}
			onClick={handleClick}
		>
			{isLoading ? (
				<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
			) : (
				<Icons.google className="mr-2 h-4 w-4" />
			)}{" "}
			Google
		</Button>
	);
}

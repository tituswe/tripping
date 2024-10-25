import Link from "next/link";

export function Footer() {
	return (
		<div className="z-20 w-full bg-background border-t shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-4 md:mx-8 flex h-6 items-center">
				<p className="text-xs leading-loose text-muted-foreground text-left">
					A project built by{" "}
					<Link
						href="https://github.com/tituswe"
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium underline underline-offset-4"
					>
						@tituswe
					</Link>
					.
				</p>
				<p className="ml-1 text-xs leading-loose text-muted-foreground text-left">
					Join the Telegram community{" "}
					<Link
						href="https://t.me/trippingaround"
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium underline underline-offset-4"
					>
						here
					</Link>
					!
				</p>
			</div>
		</div>
	);
}

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="global flex flex-col h-screen w-full justify-center items-center space-y-4">
			<h2 className="text-xl">404 Page Not Found</h2>
			<Link href="/">
				<Button variant="secondary">Return Home</Button>
			</Link>
		</div>
	);
}

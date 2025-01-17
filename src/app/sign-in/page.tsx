import { Metadata } from "next";
import Link from "next/link";

import { UserAuthForm } from "@/components/auth/user-auth-form";
import { Send } from "lucide-react";

export const metadata: Metadata = {
	title: "Authentication",
	description: "Authentication forms built using the components."
};

export default function SignIn() {
	return (
		<>
			<div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
				<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
					<div className="absolute inset-0 bg-zinc-900" />
					<Link
						href="/"
						className="relative z-20 flex items-center text-lg font-medium"
					>
						<Send className="h-6 w-6 mr-2" />
						trippin
					</Link>
					<div className="relative z-20 mt-auto">
						<blockquote className="space-y-2">
							<p className="text-lg">&ldquo;Fly me to the moon.&rdquo;</p>
							<footer className="text-sm">Frank Sinatra</footer>
						</blockquote>
					</div>
				</div>
				<div className="lg:p-8">
					<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
						<div className="flex flex-col space-y-2 text-center">
							<h1 className="text-2xl font-semibold tracking-tight">
								Sign in to your account
							</h1>
							<p className="text-sm text-muted-foreground">Continue with</p>
						</div>
						<UserAuthForm />
						<p className="px-8 text-center text-sm text-muted-foreground">
							By clicking continue, you agree to our{" "}
							<Link
								href="/terms"
								className="underline underline-offset-4 hover:text-primary"
							>
								Terms of Service
							</Link>{" "}
							and{" "}
							<Link
								href="/privacy"
								className="underline underline-offset-4 hover:text-primary"
							>
								Privacy Policy
							</Link>
							.
						</p>
					</div>
				</div>
			</div>
		</>
	);
}

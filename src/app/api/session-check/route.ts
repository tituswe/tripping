import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
	// Get session using getServerSession
	const session = await auth();

	if (session) {
		// Return session data as JSON if session exists
		return NextResponse.json({ session });
	} else {
		// Return a 401 error if session is not found
		return NextResponse.json(
			{ session: null, message: "No session found" },
			{ status: 401 }
		);
	}
}

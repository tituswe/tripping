import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return new Response("Unauthorized", { status: 401 });
	}

	console.log("Cron job test ", new Date());

	return new NextResponse("Cron job ran", { status: 200 });
}

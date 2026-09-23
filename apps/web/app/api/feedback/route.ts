import { NextResponse } from "next/server";
import { addFeedback } from "@/lib/stats";

export async function POST(request: Request) {
	let body: { rating?: unknown; comment?: unknown };
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Send JSON." }, { status: 400 });
	}
	const result = addFeedback(body.rating, body.comment);
	if (typeof result === "string") {
		return NextResponse.json({ error: result }, { status: 400 });
	}
	return NextResponse.json(result);
}

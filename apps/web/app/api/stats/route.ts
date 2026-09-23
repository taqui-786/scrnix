import { NextResponse } from "next/server";
import { stats } from "@/lib/stats";

export function GET() {
	return NextResponse.json(stats());
}

import { NextResponse } from "next/server";
import { recordDownload } from "@/lib/stats";

export function GET(request: Request) {
	recordDownload();
	const target = process.env.SCRINX_DEB_URL ?? "/scrinx.deb";
	const url = target.startsWith("http") ? target : new URL(target, request.url);
	return NextResponse.redirect(url, 302);
}

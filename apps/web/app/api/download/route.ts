import { NextResponse } from "next/server";
import { getDownloadRedirectUrl, type PackageFormat } from "@/lib/releases";
import { recordDownload } from "@/lib/stats";

export function GET(request: Request) {
	recordDownload();
	const { searchParams } = new URL(request.url);
	const rawFormat = searchParams.get("format");
	const format: PackageFormat =
		rawFormat === "appimage" || rawFormat === "tar" ? rawFormat : "deb";
	const version =
		searchParams.get("v") || searchParams.get("version") || undefined;

	let destination: string;
	if (format === "deb" && !version && process.env.SCRINX_DEB_URL) {
		destination = process.env.SCRINX_DEB_URL;
	} else {
		destination = getDownloadRedirectUrl(format, { version });
	}

	const redirectUrl = destination.startsWith("http")
		? destination
		: new URL(destination, request.url).toString();

	return NextResponse.redirect(redirectUrl, {
		status: 302,
		headers: {
			"Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
		},
	});
}

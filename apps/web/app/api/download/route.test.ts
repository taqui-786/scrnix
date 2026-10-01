import assert from "node:assert/strict";
import { test } from "node:test";
import { GET } from "./route";

test("GET /api/download redirects to default deb package", () => {
	const req = new Request("https://scrinx.com/api/download");
	const res = GET(req);

	assert.equal(res.status, 302);
	const location = res.headers.get("location");
	assert.ok(
		location?.includes("scrinx-latest-amd64.deb") || location?.endsWith(".deb"),
	);
});

test("GET /api/download?format=appimage redirects to AppImage", () => {
	const req = new Request("https://scrinx.com/api/download?format=appimage");
	const res = GET(req);

	assert.equal(res.status, 302);
	const location = res.headers.get("location");
	assert.ok(
		location?.includes("Scrinx-latest-x86_64.AppImage") ||
			location?.endsWith(".AppImage"),
	);
});

test("GET /api/download?format=tar&version=0.6.0 redirects to versioned tarball", () => {
	const req = new Request(
		"https://scrinx.com/api/download?format=tar&version=0.6.0",
	);
	const res = GET(req);

	assert.equal(res.status, 302);
	const location = res.headers.get("location");
	assert.ok(
		location?.includes("/releases/v0.6.0/scrinx-0.6.0-linux-x86_64.tar.gz"),
	);
});

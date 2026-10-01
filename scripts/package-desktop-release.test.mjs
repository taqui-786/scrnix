import assert from "node:assert/strict";
import { test } from "node:test";
import {
	formatBytes,
	generateManifests,
	getDesktopVersionFromCargo,
} from "./package-desktop-release.mjs";

test("getDesktopVersionFromCargo extracts version from Cargo.toml content", () => {
	const mockCargo = `
[package]
name = "cap-desktop"
version = "0.6.0"
edition = "2024"
`;
	assert.equal(getDesktopVersionFromCargo(mockCargo), "0.6.0");
});

test("formatBytes converts byte counts to human-readable strings", () => {
	assert.equal(formatBytes(1024), "1.0 KB");
	assert.equal(formatBytes(40265318), "38.4 MB");
	assert.equal(formatBytes(43201331), "41.2 MB");
});

test("generateManifests generates valid release.json and latest.json structures", () => {
	const files = [
		{
			format: "deb",
			filename: "scrinx_0.6.0_amd64.deb",
			sizeBytes: 40265318,
			sha256: "abcdef1234567890",
		},
		{
			format: "appimage",
			filename: "Scrinx-0.6.0-x86_64.AppImage",
			sizeBytes: 43201331,
			sha256: "1234567890abcdef",
		},
		{
			format: "tar",
			filename: "scrinx-0.6.0-linux-x86_64.tar.gz",
			sizeBytes: 38587596,
			sha256: "fedcba0987654321",
		},
	];

	const { releaseJson, latestJson } = generateManifests({
		version: "0.6.0",
		files,
		publicUrlBase: "https://releases.scrinx.com",
		releaseDate: "2026-10-01T21:00:00.000Z",
	});

	assert.equal(releaseJson.version, "0.6.0");
	assert.equal(releaseJson.releaseDate, "2026-10-01T21:00:00.000Z");
	assert.equal(releaseJson.files.length, 3);

	assert.equal(latestJson.version, "0.6.0");
	assert.equal(latestJson.files.deb.filename, "scrinx_0.6.0_amd64.deb");
	assert.equal(latestJson.files.deb.size, "38.4 MB");
	assert.equal(
		latestJson.files.deb.url,
		"https://releases.scrinx.com/releases/v0.6.0/scrinx_0.6.0_amd64.deb",
	);
	assert.equal(
		latestJson.files.appimage.url,
		"https://releases.scrinx.com/releases/v0.6.0/Scrinx-0.6.0-x86_64.AppImage",
	);
});

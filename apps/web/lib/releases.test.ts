import assert from "node:assert/strict";
import { test } from "node:test";
import {
	buildPackageDetails,
	formatInstallCommand,
	getDownloadRedirectUrl,
} from "./releases";

test("formatInstallCommand formats accurate CLI instructions", () => {
	assert.equal(
		formatInstallCommand("deb", "scrinx_0.6.0_amd64.deb"),
		"sudo dpkg -i scrinx_0.6.0_amd64.deb",
	);
	assert.equal(
		formatInstallCommand("appimage", "Scrinx-0.6.0-x86_64.AppImage"),
		"chmod +x Scrinx-0.6.0-x86_64.AppImage && ./Scrinx-0.6.0-x86_64.AppImage",
	);
	assert.equal(
		formatInstallCommand("tar", "scrinx-0.6.0-linux-x86_64.tar.gz"),
		"tar -xzf scrinx-0.6.0-linux-x86_64.tar.gz",
	);
});

test("buildPackageDetails merges manifest data with presentation metadata", () => {
	const packages = buildPackageDetails({
		version: "0.6.0",
		releaseDate: "2026-10-01T21:00:00.000Z",
		files: {
			deb: {
				filename: "scrinx_0.6.0_amd64.deb",
				url: "https://releases.scrinx.com/releases/v0.6.0/scrinx_0.6.0_amd64.deb",
				size: "38.4 MB",
			},
			appimage: {
				filename: "Scrinx-0.6.0-x86_64.AppImage",
				url: "https://releases.scrinx.com/releases/v0.6.0/Scrinx-0.6.0-x86_64.AppImage",
				size: "41.2 MB",
			},
			tar: {
				filename: "scrinx-0.6.0-linux-x86_64.tar.gz",
				url: "https://releases.scrinx.com/releases/v0.6.0/scrinx-0.6.0-linux-x86_64.tar.gz",
				size: "36.8 MB",
			},
		},
	});

	assert.equal(packages.deb.file, "scrinx_0.6.0_amd64.deb");
	assert.equal(packages.deb.size, "38.4 MB");
	assert.equal(packages.deb.install, "sudo dpkg -i scrinx_0.6.0_amd64.deb");
	assert.equal(packages.appimage.file, "Scrinx-0.6.0-x86_64.AppImage");
});

test("getDownloadRedirectUrl resolves correct destination URL", () => {
	const debUrl = getDownloadRedirectUrl("deb", {
		baseUrl: "https://releases.scrinx.com",
		version: "0.6.0",
	});
	assert.equal(
		debUrl,
		"https://releases.scrinx.com/releases/v0.6.0/scrinx_0.6.0_amd64.deb",
	);

	const appimageUrl = getDownloadRedirectUrl("appimage", {
		baseUrl: "https://releases.scrinx.com",
		version: "0.6.0",
	});
	assert.equal(
		appimageUrl,
		"https://releases.scrinx.com/releases/v0.6.0/Scrinx-0.6.0-x86_64.AppImage",
	);
});

import { execSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

export function getDesktopVersionFromCargo(cargoTomlContent) {
	const packageStart = cargoTomlContent.indexOf("[package]");
	const packageEnd = cargoTomlContent.indexOf("\n[", packageStart + 1);
	const section = cargoTomlContent.slice(
		packageStart,
		packageEnd === -1 ? cargoTomlContent.length : packageEnd,
	);
	const match = /^version\s*=\s*"([^"]+)"$/m.exec(section);
	if (!match) throw new Error("package.version not found in Cargo.toml");
	return match[1];
}

export function formatBytes(bytes) {
	if (bytes === 0) return "0 B";
	const units = ["B", "KB", "MB", "GB"];
	const exponent = Math.min(
		Math.floor(Math.log(bytes) / Math.log(1024)),
		units.length - 1,
	);
	const value = bytes / 1024 ** exponent;
	return `${value.toFixed(1)} ${units[exponent]}`;
}

export function generateManifests({
	version,
	files,
	publicUrlBase,
	releaseDate = new Date().toISOString(),
}) {
	const normalizedBase = publicUrlBase.replace(/\/+$/, "");
	const filesMap = {};

	for (const file of files) {
		const downloadUrl = `${normalizedBase}/releases/v${version}/${file.filename}`;
		filesMap[file.format] = {
			filename: file.filename,
			url: downloadUrl,
			size: formatBytes(file.sizeBytes),
			sizeBytes: file.sizeBytes,
			sha256: file.sha256,
		};
	}

	const releaseJson = {
		version,
		releaseDate,
		files: files.map((f) => ({
			format: f.format,
			filename: f.filename,
			size: formatBytes(f.sizeBytes),
			sizeBytes: f.sizeBytes,
			sha256: f.sha256,
		})),
	};

	const latestJson = {
		version,
		releaseDate,
		files: filesMap,
	};

	return { releaseJson, latestJson };
}

async function computeSha256(filePath) {
	const fileBuffer = await fs.readFile(filePath);
	return createHash("sha256").update(fileBuffer).digest("hex");
}

async function runStep(cmd, args, cwd = repoRoot) {
	console.log(`> ${cmd} ${args.join(" ")}`);
	const result = spawnSync(cmd, args, {
		cwd,
		stdio: "inherit",
		env: process.env,
	});
	if (result.status !== 0) {
		throw new Error(
			`Command failed with code ${result.status}: ${cmd} ${args.join(" ")}`,
		);
	}
}

export async function packageRelease({ target, version, outputDir }) {
	const cargoPath = path.join(repoRoot, "apps/desktop/src-tauri/Cargo.toml");
	const cargoContent = await fs.readFile(cargoPath, "utf8");
	const resolvedVersion = version || getDesktopVersionFromCargo(cargoContent);

	console.log(
		`Packaging Scrinx release v${resolvedVersion} for target ${target}...`,
	);

	await runStep("node", ["scripts/sync-desktop-versions.mjs"]);
	await runStep("node", ["scripts/build-desktop-binaries.mjs", target]);
	await runStep("node", ["scripts/run-gpui-build.mjs", "release"]);
	await runStep(
		"bun",
		["run", "preparescript", "--release"],
		path.join(repoRoot, "apps/desktop"),
	);

	const desktopDir = path.join(repoRoot, "apps/desktop");
	await runStep(
		"bun",
		[
			"run",
			"tauri",
			"build",
			"--target",
			target,
			"--bundles",
			"deb,appimage",
			"--config",
			"src-tauri/tauri.prod.conf.json",
		],
		desktopDir,
	);

	const distDir = outputDir || path.join(repoRoot, "target", "dist-release");
	const latestDistDir = path.join(distDir, "latest");
	await fs.mkdir(distDir, { recursive: true });
	await fs.mkdir(latestDistDir, { recursive: true });

	const candidateDebDirs = [
		path.join(repoRoot, "target", target, "release/bundle/deb"),
		path.join(repoRoot, "target/release/bundle/deb"),
	];
	const candidateAppImageDirs = [
		path.join(repoRoot, "target", target, "release/bundle/appimage"),
		path.join(repoRoot, "target/release/bundle/appimage"),
	];

	let debFile = null;
	for (const dir of candidateDebDirs) {
		try {
			const items = await fs.readdir(dir);
			const found = items.find((f) => f.endsWith(".deb"));
			if (found) {
				debFile = path.join(dir, found);
				break;
			}
		} catch {}
	}

	let appImageFile = null;
	for (const dir of candidateAppImageDirs) {
		try {
			const items = await fs.readdir(dir);
			const found = items.find((f) => f.endsWith(".AppImage"));
			if (found) {
				appImageFile = path.join(dir, found);
				break;
			}
		} catch {}
	}

	const collectedFiles = [];

	if (debFile) {
		const destFilename = `scrinx_${resolvedVersion}_amd64.deb`;
		const destPath = path.join(distDir, destFilename);
		await fs.copyFile(debFile, destPath);
		const stat = await fs.stat(destPath);
		const sha256 = await computeSha256(destPath);
		collectedFiles.push({
			format: "deb",
			filename: destFilename,
			sizeBytes: stat.size,
			sha256,
		});

		await fs.copyFile(
			destPath,
			path.join(latestDistDir, "scrinx-latest-amd64.deb"),
		);
	}

	if (appImageFile) {
		const destFilename = `Scrinx-${resolvedVersion}-x86_64.AppImage`;
		const destPath = path.join(distDir, destFilename);
		await fs.copyFile(appImageFile, destPath);
		const stat = await fs.stat(destPath);
		const sha256 = await computeSha256(destPath);
		collectedFiles.push({
			format: "appimage",
			filename: destFilename,
			sizeBytes: stat.size,
			sha256,
		});

		await fs.copyFile(
			destPath,
			path.join(latestDistDir, "Scrinx-latest-x86_64.AppImage"),
		);
	}

	const mainBinaryPath = path.join(
		repoRoot,
		"target",
		target,
		"release",
		"scrinx",
	);
	const fallbackBinaryPath = path.join(repoRoot, "target/release/scrinx");
	const binaryToPackage = (await fs
		.access(mainBinaryPath)
		.then(() => true)
		.catch(() => false))
		? mainBinaryPath
		: (await fs
					.access(fallbackBinaryPath)
					.then(() => true)
					.catch(() => false))
			? fallbackBinaryPath
			: null;

	if (binaryToPackage) {
		const tarFilename = `scrinx-${resolvedVersion}-linux-x86_64.tar.gz`;
		const tarDestPath = path.join(distDir, tarFilename);
		const tempTarDir = path.join(distDir, "tar-staging");
		await fs.mkdir(tempTarDir, { recursive: true });
		await fs.copyFile(binaryToPackage, path.join(tempTarDir, "scrinx"));
		execSync(`tar -czf "${tarDestPath}" -C "${tempTarDir}" scrinx`);
		await fs.rm(tempTarDir, { recursive: true, force: true });

		const stat = await fs.stat(tarDestPath);
		const sha256 = await computeSha256(tarDestPath);
		collectedFiles.push({
			format: "tar",
			filename: tarFilename,
			sizeBytes: stat.size,
			sha256,
		});

		await fs.copyFile(
			tarDestPath,
			path.join(latestDistDir, "scrinx-latest-linux-x86_64.tar.gz"),
		);
	}

	const publicUrlBase =
		process.env.R2_PUBLIC_URL ||
		process.env.NEXT_PUBLIC_RELEASES_URL ||
		"https://releases.scrinx.com";

	const { releaseJson, latestJson } = generateManifests({
		version: resolvedVersion,
		files: collectedFiles,
		publicUrlBase,
	});

	await fs.writeFile(
		path.join(distDir, "release.json"),
		JSON.stringify(releaseJson, null, "\t"),
		"utf8",
	);
	await fs.writeFile(
		path.join(distDir, "latest.json"),
		JSON.stringify(latestJson, null, "\t"),
		"utf8",
	);
	await fs.writeFile(
		path.join(latestDistDir, "latest.json"),
		JSON.stringify(latestJson, null, "\t"),
		"utf8",
	);

	const checksums = collectedFiles
		.map((f) => `${f.sha256}  ${f.filename}`)
		.join("\n");
	await fs.writeFile(
		path.join(distDir, "SHA256SUMS.txt"),
		`${checksums}\n`,
		"utf8",
	);

	console.log(`Successfully generated release artifacts in ${distDir}`);
	return { resolvedVersion, collectedFiles, distDir };
}

if (
	process.argv[1] &&
	path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
	const target =
		process.argv[2] ||
		process.env.RUST_TARGET_TRIPLE ||
		"x86_64-unknown-linux-gnu";
	const version = process.argv[3];
	packageRelease({ target, version }).catch((err) => {
		console.error("Release packaging failed:", err);
		process.exit(1);
	});
}

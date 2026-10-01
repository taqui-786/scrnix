export type PackageFormat = "deb" | "appimage" | "tar";

export type PackageDetails = {
	format: PackageFormat;
	label: string;
	file: string;
	size: string;
	distros: string;
	install: string;
	url: string;
};

export type ReleaseFileEntry = {
	filename: string;
	url: string;
	size: string;
	sizeBytes?: number;
	sha256?: string;
};

export type ReleaseManifest = {
	version: string;
	releaseDate?: string;
	files: Record<PackageFormat, ReleaseFileEntry>;
};

export const DEFAULT_VERSION = "0.6.0";

const defaultDistros: Record<PackageFormat, string> = {
	deb: "Ubuntu 22.04+, Debian 12+, Pop!_OS, Mint",
	appimage: "Arch, Fedora, openSUSE, any Linux",
	tar: "Headless systems, custom setups, CLI scripts",
};

const defaultLabels: Record<PackageFormat, string> = {
	deb: "Debian package",
	appimage: "AppImage",
	tar: "Standalone tarball",
};

export function formatInstallCommand(
	format: PackageFormat,
	filename: string,
): string {
	switch (format) {
		case "deb":
			return `sudo dpkg -i ${filename}`;
		case "appimage":
			return `chmod +x ${filename} && ./${filename}`;
		case "tar":
			return `tar -xzf ${filename}`;
	}
}

export function getDefaultManifest(
	version = DEFAULT_VERSION,
	baseUrl = getPublicReleaseBaseUrl(),
): ReleaseManifest {
	const normalizedBase = baseUrl.replace(/\/+$/, "");
	return {
		version,
		releaseDate: new Date().toISOString(),
		files: {
			deb: {
				filename: `scrinx_${version}_amd64.deb`,
				url: `${normalizedBase}/releases/v${version}/scrinx_${version}_amd64.deb`,
				size: "38.4 MB",
			},
			appimage: {
				filename: `Scrinx-${version}-x86_64.AppImage`,
				url: `${normalizedBase}/releases/v${version}/Scrinx-${version}-x86_64.AppImage`,
				size: "41.2 MB",
			},
			tar: {
				filename: `scrinx-${version}-linux-x86_64.tar.gz`,
				url: `${normalizedBase}/releases/v${version}/scrinx-${version}-linux-x86_64.tar.gz`,
				size: "36.8 MB",
			},
		},
	};
}

export function buildPackageDetails(
	manifest: ReleaseManifest,
): Record<PackageFormat, PackageDetails> {
	const formats: PackageFormat[] = ["deb", "appimage", "tar"];
	const details = {} as Record<PackageFormat, PackageDetails>;

	for (const format of formats) {
		const fileEntry = manifest.files?.[format];
		const filename =
			fileEntry?.filename ??
			(format === "deb"
				? `scrinx_${manifest.version}_amd64.deb`
				: format === "appimage"
					? `Scrinx-${manifest.version}-x86_64.AppImage`
					: `scrinx-${manifest.version}-linux-x86_64.tar.gz`);

		details[format] = {
			format,
			label: defaultLabels[format],
			file: filename,
			size: fileEntry?.size ?? "38.4 MB",
			distros: defaultDistros[format],
			install: formatInstallCommand(format, filename),
			url:
				fileEntry?.url ??
				getDownloadRedirectUrl(format, { version: manifest.version }),
		};
	}

	return details;
}

export function getPublicReleaseBaseUrl(): string {
	return (
		process.env.NEXT_PUBLIC_RELEASES_URL ||
		process.env.R2_PUBLIC_URL ||
		"https://releases.scrinx.com"
	);
}

export function getDownloadRedirectUrl(
	format: PackageFormat = "deb",
	options?: { baseUrl?: string; version?: string },
): string {
	const baseUrl = (options?.baseUrl || getPublicReleaseBaseUrl()).replace(
		/\/+$/,
		"",
	);
	const version = options?.version;

	if (version) {
		const filename =
			format === "deb"
				? `scrinx_${version}_amd64.deb`
				: format === "appimage"
					? `Scrinx-${version}-x86_64.AppImage`
					: `scrinx-${version}-linux-x86_64.tar.gz`;
		return `${baseUrl}/releases/v${version}/${filename}`;
	}

	const latestFilename =
		format === "deb"
			? "scrinx-latest-amd64.deb"
			: format === "appimage"
				? "Scrinx-latest-x86_64.AppImage"
				: "scrinx-latest-linux-x86_64.tar.gz";

	return `${baseUrl}/releases/latest/${latestFilename}`;
}

export async function getLatestRelease(): Promise<{
	version: string;
	packages: Record<PackageFormat, PackageDetails>;
}> {
	const baseUrl = getPublicReleaseBaseUrl().replace(/\/+$/, "");
	const manifestUrl = `${baseUrl}/releases/latest/latest.json`;

	try {
		const res = await fetch(manifestUrl, {
			next: { revalidate: 60 },
		});
		if (res.ok) {
			const data = (await res.json()) as ReleaseManifest;
			if (data?.version && data?.files) {
				return {
					version: data.version,
					packages: buildPackageDetails(data),
				};
			}
		}
	} catch {}

	const fallback = getDefaultManifest();
	return {
		version: fallback.version,
		packages: buildPackageDetails(fallback),
	};
}

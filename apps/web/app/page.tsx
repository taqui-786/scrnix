"use client";

import {
	Check,
	ChevronDown,
	Copy,
	Download,
	Package,
	Pause,
	Play,
	Sparkles,
	Video,
} from "lucide-react";
import { useId, useState } from "react";

type PackageFormat = "deb" | "appimage" | "tar";

type PackageDetails = {
	label: string;
	file: string;
	size: string;
	distros: string;
	install: string;
};

const formatDetails: Record<PackageFormat, PackageDetails> = {
	deb: {
		label: "Debian package",
		file: "scrinx_0.1.0_amd64.deb",
		size: "38.4 MB",
		distros: "Ubuntu 22.04+, Debian 12+, Pop!_OS, Mint",
		install: "sudo dpkg -i scrinx_0.1.0_amd64.deb",
	},
	appimage: {
		label: "AppImage",
		file: "Scrinx-0.1.0-x86_64.AppImage",
		size: "41.2 MB",
		distros: "Arch, Fedora, openSUSE, any Linux",
		install: "chmod +x Scrinx-0.1.0-x86_64.AppImage",
	},
	tar: {
		label: "Standalone tarball",
		file: "scrinx-linux-x86_64.tar.gz",
		size: "36.8 MB",
		distros: "Headless systems, custom setups, CLI scripts",
		install: "tar -xzf scrinx-linux-x86_64.tar.gz",
	},
};

export default function Page() {
	const topId = useId();
	const installId = useId();
	const [selectedFormat, setSelectedFormat] = useState<PackageFormat>("deb");
	const [isPreviewing, setIsPreviewing] = useState(true);
	const [copied, setCopied] = useState(false);
	const activePackage = formatDetails[selectedFormat];

	async function copyCommand() {
		try {
			await navigator.clipboard.writeText(activePackage.install);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1800);
		} catch {
			setCopied(false);
		}
	}

	return (
		<div className="landing-page">
			<header className="landing-header">
				<div className="header-inner">
					<a className="brand-mark" href={`#${topId}`} aria-label="Scrinx home">
						<span className="brand-icon">
							<Video className="h-4 w-4" strokeWidth={1.8} />
						</span>
						<span className="brand-name">Scrinx</span>
						<span className="brand-tag">Linux</span>
					</a>
					<div className="header-status">
						<span className="status-dot" />
						<span>Native studio / v0.1.0</span>
					</div>
					<a
						className="button button-small button-primary"
						href="/api/download"
					>
						Download
						<Download className="h-3.5 w-3.5" />
					</a>
				</div>
			</header>

			<main id={topId} className="landing-main">
				<section className="hero-panel">
					<div className="hero-copy">
						<div className="eyebrow">
							<span className="eyebrow-line" />
							Screen recording, re-shaped
						</div>
						<h1>
							Make every frame
							<span>worth watching.</span>
						</h1>
						<p className="hero-description">
							A local-first screen recorder and studio that keeps the whole
							story on your machine.
						</p>
						<div className="hero-actions">
							<a className="button button-primary" href="/api/download">
								<Download className="h-4 w-4" />
								Download Scrinx
							</a>
							<a className="button button-quiet" href={`#${installId}`}>
								View install
								<ChevronDown className="h-4 w-4 -rotate-90" />
							</a>
						</div>
						<div className="hero-note">
							<span>4K 60</span>
							<span>Wayland + X11</span>
							<span>No cloud</span>
						</div>
					</div>

					<aside className="hero-card" aria-label="Scrinx studio preview">
						<div className="card-topline">
							<div>
								<span className="card-kicker">LIVE CAPTURE</span>
								<strong>session_01.mp4</strong>
							</div>
							<span className="card-live">READY</span>
						</div>
						<div
							className={`studio-stage ${isPreviewing ? "is-playing" : ""}`}
							role="img"
							aria-label="Animated Scrinx camera focus preview"
						>
							<div className="stage-grid" aria-hidden="true" />
							<div className="stage-label">REC / WINDOW</div>
							<div className="stage-terminal">
								<span className="text-primary">$ scrinx --capture</span>
								<span>wayland portal connected</span>
								<span>focus tracking enabled</span>
							</div>
							<div className="stage-focus" aria-hidden="true">
								<span />
							</div>
							<div className="stage-cursor">
								<Sparkles className="h-3 w-3" />
								camera focus
							</div>
							<div className="stage-footer">
								<span>00:01:24</span>
								<span>studio timeline ready</span>
							</div>
						</div>
						<div className="card-controls">
							<button
								type="button"
								className="preview-play"
								onClick={() => setIsPreviewing(!isPreviewing)}
								aria-label={isPreviewing ? "Pause preview" : "Play preview"}
								aria-pressed={isPreviewing}
							>
								{isPreviewing ? (
									<Pause className="h-3.5 w-3.5 fill-current" />
								) : (
									<Play className="h-3.5 w-3.5 fill-current" />
								)}
							</button>
							<div className="preview-timeline" aria-hidden="true">
								<div className="preview-timeline-fill" />
							</div>
							<span className="preview-time">01:24 / 03:00</span>
						</div>
					</aside>
				</section>

				<section id={installId} className="install-dock">
					<div className="dock-heading">
						<span className="eyebrow-line" />
						<div>
							<span className="card-kicker">INSTALL / v0.1.0</span>
							<strong>Ready to record</strong>
						</div>
					</div>
					<div
						className="format-tabs"
						role="tablist"
						aria-label="Linux package format"
					>
						{(Object.keys(formatDetails) as PackageFormat[]).map((format) => (
							<button
								type="button"
								role="tab"
								aria-selected={selectedFormat === format}
								className={selectedFormat === format ? "is-active" : ""}
								onClick={() => setSelectedFormat(format)}
								key={format}
							>
								{formatDetails[format].label}
							</button>
						))}
					</div>
					<div className="dock-file">
						<Package className="h-4 w-4" />
						<div>
							<strong>{activePackage.file}</strong>
							<span>
								{activePackage.size} · {activePackage.distros}
							</span>
						</div>
					</div>
					<div className="install-command">
						<code>
							<span className="text-primary">$</span> {activePackage.install}
						</code>
						<button
							type="button"
							onClick={copyCommand}
							aria-label="Copy install command"
						>
							{copied ? (
								<Check className="h-3.5 w-3.5" />
							) : (
								<Copy className="h-3.5 w-3.5" />
							)}
						</button>
					</div>
					<a
						className="button button-primary dock-download"
						href="/api/download"
					>
						<Download className="h-4 w-4" />
						Download
					</a>
				</section>
			</main>

			<footer className="landing-footer">
				<div className="footer-left">
					<span className="status-dot" />
					<span>Open source / local by default</span>
				</div>
				<div className="footer-right">
					<span>PipeWire</span>
					<span>VA-API</span>
					<span>PulseAudio</span>
				</div>
			</footer>
		</div>
	);
}

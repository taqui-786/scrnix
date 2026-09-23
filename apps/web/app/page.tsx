"use client";

import { type ClassValue, clsx } from "clsx";
import { Download, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

type Stats = { downloads: number; ratingCount: number; ratingAverage: number };

const features = [
	[
		"Studio editor",
		"Cut, zoom, and change the background on the recording that already lives on disk.",
	],
	[
		"4K / 60 FPS",
		"Capture at the resolution and frame rate you pick. No upgrade gate.",
	],
	[
		"Wayland and X11",
		"Records on current Ubuntu desktops, then exports a local MP4 or GIF.",
	],
	[
		"Nothing leaves the machine",
		"No account, no watermark, no upload. The .deb is the whole product.",
	],
];

export default function Page() {
	const [stats, setStats] = useState<Stats>({
		downloads: 0,
		ratingCount: 0,
		ratingAverage: 0,
	});
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const [note, setNote] = useState("");
	const [linux, setLinux] = useState(true);

	useEffect(() => {
		setLinux(/linux/i.test(navigator.userAgent));
		fetch("/api/stats")
			.then((response) => response.json())
			.then(setStats)
			.catch(() => setNote("Stats are unavailable."));
	}, []);

	async function sendFeedback(event: React.FormEvent) {
		event.preventDefault();
		const response = await fetch("/api/feedback", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ rating, comment }),
		});
		const body = await response.json();
		if (!response.ok) {
			setNote(body.error ?? "Could not save feedback.");
			return;
		}
		setStats(body);
		setComment("");
		setNote("Saved on this server process.");
	}

	return (
		<main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-16 px-6 py-16">
			<header className="text-sm text-stone-300">
				<p className="font-semibold tracking-wide text-stone-100">Scrinx</p>
			</header>
			<section className="grid gap-8">
				<p className="text-sm uppercase tracking-[0.22em] text-amber-200/80">
					Ubuntu desktop
				</p>
				<h1 className="max-w-3xl text-5xl font-semibold leading-tight text-stone-50 sm:text-6xl">
					Screen Recording & Studio Editing. 100% Local. 100% Free.
				</h1>
				<p className="max-w-2xl text-lg text-stone-300">
					A local recorder and editor for Linux. The video stays in a folder you
					can open.
				</p>
				<div className="flex flex-wrap items-center gap-4">
					<a
						href="/api/download"
						className="inline-flex items-center gap-2 rounded-full bg-amber-200 px-5 py-3 font-medium text-stone-950"
					>
						<Download size={18} />
						Download .deb for Ubuntu
					</a>
					<p className="text-sm text-stone-400">
						{linux
							? "Linux detected."
							: "This installer is the Ubuntu package."}{" "}
						{stats.downloads.toLocaleString()} downloads counted here.
					</p>
				</div>
				<ul className="flex flex-wrap gap-2 text-sm text-stone-200">
					{["No Watermark", "No Time Limits", "No Sign-in", "100% Offline"].map(
						(badge) => (
							<li
								key={badge}
								className="rounded-full border border-white/15 px-3 py-1"
							>
								{badge}
							</li>
						),
					)}
				</ul>
			</section>
			<section className="grid gap-4 sm:grid-cols-2">
				{features.map(([title, copy]) => (
					<article
						key={title}
						className="rounded-3xl border border-white/10 bg-white/5 p-6"
					>
						<h2 className="text-xl font-medium">{title}</h2>
						<p className="mt-2 text-stone-300">{copy}</p>
					</article>
				))}
			</section>
			<section className="max-w-xl">
				<h2 className="text-2xl font-medium">How is Scrinx?</h2>
				<p className="mt-2 text-sm text-stone-400">
					Average {stats.ratingAverage ? stats.ratingAverage.toFixed(1) : "—"}{" "}
					from {stats.ratingCount} ratings.
				</p>
				<form onSubmit={sendFeedback} className="mt-4 grid gap-3">
					<div className="flex gap-1">
						{[1, 2, 3, 4, 5].map((value) => (
							<button
								key={value}
								type="button"
								aria-label={`${value} star${value === 1 ? "" : "s"}`}
								onClick={() => setRating(value)}
								className={cn(
									"rounded-md p-1",
									rating >= value ? "text-amber-200" : "text-stone-600",
								)}
							>
								<Star fill={rating >= value ? "currentColor" : "none"} />
							</button>
						))}
					</div>
					<textarea
						value={comment}
						onChange={(event) => setComment(event.target.value)}
						maxLength={1000}
						placeholder="Optional note"
						className="min-h-28 rounded-2xl border border-white/10 bg-black/30 p-3 text-stone-100"
					/>
					<button
						type="submit"
						className="w-fit rounded-full bg-white px-4 py-2 text-stone-950"
					>
						Send feedback
					</button>
					{note ? <p className="text-sm text-stone-400">{note}</p> : null}
				</form>
			</section>
		</main>
	);
}

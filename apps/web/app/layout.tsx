import type { Metadata } from "next";
import { Montserrat, Space_Mono } from "next/font/google";
import "./globals.css";

const sans = Montserrat({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
});

const mono = Space_Mono({
	weight: ["400", "700"],
	subsets: ["latin"],
	variable: "--font-mono",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Scrinx | Open Source Screen Recorder & Studio for Linux",
	description:
		"The modern, local-first screen recorder and video studio engineered exclusively for Linux desktops. PipeWire, VA-API hardware encoding, studio zoom, cursor smoothing, and 100% offline.",
	icons: {
		icon: "/favicon.ico",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${sans.variable} ${mono.variable}`}>
			<body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
				{children}
			</body>
		</html>
	);
}

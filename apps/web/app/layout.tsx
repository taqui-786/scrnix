import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "Scrinx | 100% Free & Open Source Screen Recorder & Studio for Linux",
	description:
		"Modern, lightweight, local-first screen recorder and video editor with smooth zoom, cursor smoothing, 4K/60fps capture, and zero cloud uploads.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={sans.variable}>
			<body>{children}</body>
		</html>
	);
}

import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
	outputFileTracingRoot: path.join(
		fileURLToPath(new URL(".", import.meta.url)),
		"../..",
	),
};

export default nextConfig;

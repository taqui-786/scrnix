import toast from "solid-toast";
import { commands } from "./tauri";

export async function openPricingPage() {
	try {
		await commands.showWindow("Upgrade");
	} catch {
		toast.error(
			"Couldn't open your browser. Visit scrinx.com/pricing to view plans.",
		);
	}
}

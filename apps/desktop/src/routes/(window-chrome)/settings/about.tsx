import * as shell from "@tauri-apps/plugin-shell";
import IconLucideExternalLink from "~icons/lucide/external-link";
import IconLucideGithub from "~icons/lucide/github";
import { Section, SettingsPageContent } from "./Setting";

export default function AboutSettings() {
	return (
		<SettingsPageContent>
			<Section
				title="Follow me on X / Twitter"
				description="Follow Taqui for updates, experiments, and new projects."
			>
				<button
					type="button"
					class="rounded-lg bg-gray-4 px-3 py-2 text-sm text-gray-12 hover:bg-gray-5"
					onClick={() => void shell.open("https://twitter.com/md_taqui_imam")}
				>
					Follow @md_taqui_imam
				</button>
			</Section>
			<Section
				title="About Scrinx"
				description="A focused, open-source desktop recording studio."
			>
				<div class="space-y-4 rounded-xl border border-gray-3 bg-gray-2 p-5 text-sm text-gray-11">
					<p>
						Scrinx was built by Md Taqui Imam, a full-stack developer from
						India.
					</p>
					<p>
						Scrinx provides a local-first workflow for recording, editing, and
						sharing your work.
					</p>
					<div class="flex flex-wrap gap-2 pt-2">
						<button
							type="button"
							class="flex items-center gap-2 rounded-lg bg-gray-4 px-3 py-2 text-gray-12 hover:bg-gray-5"
							onClick={() => void shell.open("https://taqui.in")}
						>
							<IconLucideExternalLink class="size-4" /> taqui.in
						</button>
						<button
							type="button"
							class="flex items-center gap-2 rounded-lg bg-gray-4 px-3 py-2 text-gray-12 hover:bg-gray-5"
							onClick={() =>
								void shell.open("https://github.com/taqui-786/scrnix")
							}
						>
							<IconLucideGithub class="size-4" /> GitHub
						</button>
					</div>
				</div>
			</Section>
		</SettingsPageContent>
	);
}

import { Show } from "solid-js";
import { createLicenseQuery } from "~/utils/queries";
import { Section, SectionCard, SettingsPageContent } from "./Setting";

export default function Page() {
	const license = createLicenseQuery();

	return (
		<div class="cap-settings-page h-full overflow-y-auto custom-scroll">
			<SettingsPageContent>
				<Section
					title="Plan & license"
					description="This copy of Scrinx runs entirely on your computer."
				/>
				<Show when={license.isPending}>
					<p class="text-xs text-gray-10">Loading your plan…</p>
				</Show>
				<Show when={license.isError}>
					<SectionCard padded>
						<p class="text-xs text-gray-10">Couldn't load your plan.</p>
					</SectionCard>
				</Show>
				<Show when={license.data}>
					<Section title="Your plan">
						<SectionCard padded>
							<p class="text-lg font-semibold text-gray-12">
								Scrinx Local Pro — Lifetime Free License
							</p>
							<p class="mt-1 text-xs leading-relaxed text-gray-10">
								Recording length, 4K, 60 FPS, and Studio export are unlocked.
								Recordings stay on this computer. No account or cloud upload is
								required.
							</p>
						</SectionCard>
					</Section>
				</Show>
			</SettingsPageContent>
		</div>
	);
}

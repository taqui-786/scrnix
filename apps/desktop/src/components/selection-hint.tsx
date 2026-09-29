import { Show } from "solid-js";

export type SelectionHintProps = {
	show: boolean;
	message?: string;
	class?: string;
};

export default function SelectionHint(props: SelectionHintProps) {
	return (
		<Show when={props.show}>
			<div
				class={`pointer-events-none absolute inset-0 z-40 flex items-center justify-center px-4 ${
					props.class ?? ""
				}`}
			>
				<div class="flex flex-col items-center gap-5 text-center text-white drop-shadow-md">
					<div
						class="scrinx-selection-hint-monitor mb-6 relative"
						aria-hidden="true"
					>
						<IconCapMonitor class="w-full h-full" />
						<div class="scrinx-selection-hint-screen-area">
							<div class="scrinx-selection-hint-selection" aria-hidden="true" />
							<div class="scrinx-selection-hint-cursor" aria-hidden="true">
								<IconCapCursor class="w-full h-full text-white" />
							</div>
						</div>
					</div>
					<p class="text-base font-medium max-w-xs">
						{props.message ?? "Click and drag to select an area"}
					</p>
				</div>
			</div>
		</Show>
	);
}

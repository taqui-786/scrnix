import { cx } from "cva";
import CaptionControlsLinux from "~/components/titlebar/controls/CaptionControlsLinux";

function SkeletonPulse(props: { class?: string }) {
	return (
		<div
			class={cx(
				"animate-pulse rounded-sm bg-gray-3 dark:bg-gray-4",
				props.class,
			)}
		/>
	);
}

function SkeletonButton(props: { class?: string; width?: string }) {
	return (
		<SkeletonPulse
			class={cx("h-9 rounded-lg", props.width ?? "w-9", props.class)}
		/>
	);
}

function HeaderSkeleton() {
	return (
		<div
			data-tauri-drag-region
			class="flex relative flex-row items-center w-full h-14 px-4 border-b border-gray-3 bg-gray-1 dark:bg-gray-2 shrink-0 z-20 gap-4 justify-between"
		>
			<div class="flex items-center gap-2 select-none">
				<div class="size-6 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-[11px] shadow-[0_0_10px_rgba(16,185,129,0.25)]">
					S
				</div>
				<span class="text-xs font-semibold tracking-wide text-white/90">
					Scrinx
				</span>
			</div>

			<div class="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
				<SkeletonButton width="w-24" />
				<SkeletonButton />
				<div class="w-px h-6 bg-gray-4 mx-1" />
				<SkeletonButton />
				<SkeletonButton />
				<SkeletonButton />
				<SkeletonButton />
				<SkeletonButton />
				<div class="w-px h-6 bg-gray-4 mx-1" />
				<SkeletonButton />
				<SkeletonButton />
				<SkeletonButton />
				<SkeletonButton />
				<SkeletonButton />
			</div>

			<div class="flex flex-row items-center gap-2 h-full">
				<div class="w-px h-6 bg-gray-4 mx-1" />
				<SkeletonButton />
				<SkeletonButton />
				<SkeletonButton />
				<CaptionControlsLinux />
			</div>
		</div>
	);
}

function PreviewSkeleton() {
	return (
		<div class="flex flex-col flex-1 overflow-hidden bg-gray-1 dark:bg-gray-2">
			<div class="flex-1 relative flex items-center justify-center overflow-hidden bg-gray-2 dark:bg-gray-3">
				<div class="absolute left-4 bottom-4 z-10 flex items-center gap-2 bg-gray-1 dark:bg-gray-3 rounded-lg shadow-xs p-1 border border-gray-4">
					<SkeletonButton />
					<SkeletonPulse class="w-20 h-2 rounded-full" />
					<SkeletonButton />
				</div>

				<div class="flex items-center justify-center">
					<div class="animate-spin">
						<IconCapLogo class="size-12 text-gray-400 opacity-50" />
					</div>
				</div>
			</div>
		</div>
	);
}

export function ScreenshotEditorSkeleton() {
	return (
		<>
			<div class="relative">
				<HeaderSkeleton />
			</div>
			<div class="flex overflow-y-hidden flex-1 gap-0 pb-0 w-full min-h-0 leading-5">
				<div class="flex overflow-hidden flex-col flex-1 min-h-0">
					<div class="flex overflow-y-hidden flex-row flex-1 min-h-0">
						<PreviewSkeleton />
					</div>
				</div>
			</div>
		</>
	);
}

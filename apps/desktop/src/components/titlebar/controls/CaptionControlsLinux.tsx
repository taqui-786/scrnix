import { getCurrentWindow } from "@tauri-apps/api/window";
import { cx } from "cva";
import {
	type ComponentProps,
	createSignal,
	onCleanup,
	onMount,
	Show,
	splitProps,
} from "solid-js";

export default function CaptionControlsLinux(
	props: ComponentProps<"div"> & {
		showMinimize?: boolean;
		showMaximize?: boolean;
		onMaximize?: () => void;
	},
) {
	const [local, otherProps] = splitProps(props, [
		"class",
		"showMinimize",
		"showMaximize",
		"onMaximize",
	]);
	const currentWindow = getCurrentWindow();
	const [maximized, setMaximized] = createSignal(false);

	let unlistenResize: (() => void) | undefined;

	onMount(async () => {
		try {
			const isMax = await currentWindow.isMaximized();
			setMaximized(isMax);
			unlistenResize = await currentWindow.onResized(async () => {
				const isMax = await currentWindow.isMaximized();
				setMaximized(isMax);
			});
		} catch (error) {
			console.error("Failed to check window maximized state:", error);
		}
	});

	onCleanup(() => {
		unlistenResize?.();
	});

	const showMinimize = () => local.showMinimize ?? true;
	const showMaximize = () => local.showMaximize ?? true;

	const handleMinimize = async (e: MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		await currentWindow.minimize();
	};

	const handleMaximize = async (e: MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		if (local.onMaximize) {
			local.onMaximize();
		} else {
			await currentWindow.toggleMaximize();
			const isMax = await currentWindow.isMaximized();
			setMaximized(isMax);
		}
	};

	const handleClose = async (e: MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		await currentWindow.close();
	};

	return (
		<div
			class={cx(
				"flex flex-row items-center gap-1 select-none z-30",
				local.class,
			)}
			onMouseDown={(e) => e.stopPropagation()}
			onPointerDown={(e) => e.stopPropagation()}
			{...otherProps}
		>
			<Show when={showMinimize()}>
				<button
					type="button"
					onClick={handleMinimize}
					onMouseDown={(e) => e.stopPropagation()}
					onPointerDown={(e) => e.stopPropagation()}
					aria-label="Minimize window"
					title="Minimize"
					class="flex items-center justify-center size-7 rounded-md text-white/70 hover:text-white hover:bg-white/10 active:bg-white/15 transition-all outline-hidden cursor-pointer"
				>
					<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
						<path d="M2.5 8.75a.75.75 0 0 1 .75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5a.75.75 0 0 1-.75-.75Z" />
					</svg>
				</button>
			</Show>
			<Show when={showMaximize()}>
				<button
					type="button"
					onClick={handleMaximize}
					onMouseDown={(e) => e.stopPropagation()}
					onPointerDown={(e) => e.stopPropagation()}
					aria-label={maximized() ? "Restore window" : "Maximize window"}
					title={maximized() ? "Restore" : "Maximize"}
					class="flex items-center justify-center size-7 rounded-md text-white/70 hover:text-white hover:bg-white/10 active:bg-white/15 transition-all outline-hidden cursor-pointer"
				>
					<Show
						when={maximized()}
						fallback={
							<svg
								width="12"
								height="12"
								viewBox="0 0 16 16"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M3.75 2.5a1.25 1.25 0 0 0-1.25 1.25v8.5c0 .69.56 1.25 1.25 1.25h8.5c.69 0 1.25-.56 1.25-1.25v-8.5c0-.69-.56-1.25-1.25-1.25h-8.5ZM4 4h8v8H4V4Z"
									clip-rule="evenodd"
								/>
							</svg>
						}
					>
						<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
							<path d="M5.5 3.5h7v7h-1.5v-5.5H5.5V3.5Z" />
							<path
								fill-rule="evenodd"
								d="M3.5 5.5A1 1 0 0 1 4.5 4.5h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6Zm1.5.5v5h5V6H5Z"
								clip-rule="evenodd"
							/>
						</svg>
					</Show>
				</button>
			</Show>
			<button
				type="button"
				onClick={handleClose}
				onMouseDown={(e) => e.stopPropagation()}
				onPointerDown={(e) => e.stopPropagation()}
				aria-label="Close window"
				title="Close"
				class="flex items-center justify-center size-7 rounded-md text-white/70 hover:text-white hover:bg-rose-600 active:bg-rose-700 transition-all outline-hidden cursor-pointer"
			>
				<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
					<path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
				</svg>
			</button>
		</div>
	);
}

import { Popover } from "@kobalte/core/popover";
import { cx } from "cva";
import { type Component, Show } from "solid-js";
import Tooltip from "~/components/Tooltip";
import IconLucideAppWindowMac from "~icons/lucide/app-window-mac";
import IconLucideBug from "~icons/lucide/bug";
import IconLucideChevronDown from "~icons/lucide/chevron-down";
import IconLucideCircleHelp from "~icons/lucide/circle-help";
import IconLucideCrop from "~icons/lucide/crop";
import IconLucideGripHorizontal from "~icons/lucide/grip-horizontal";
import IconLucideImage from "~icons/lucide/image";
import IconLucideMoreHorizontal from "~icons/lucide/more-horizontal";
import IconLucideScanText from "~icons/lucide/scan-text";
import IconLucideSettings from "~icons/lucide/settings";
import IconLucideSliders from "~icons/lucide/sliders";
import IconLucideSquarePlay from "~icons/lucide/square-play";
import IconLucideVideo from "~icons/lucide/video";
import IconLucideX from "~icons/lucide/x";
import IconMdiMonitor from "~icons/mdi/monitor";

export interface ControlDockProps {
	mode: "studio" | "screenshot";
	onModeChange: (mode: "studio" | "screenshot") => void;
	targetMode: "display" | "window" | "area" | "camera" | null;
	onSelectTarget: (mode: "display" | "window" | "area") => void;
	onOpenDisplayMenu: () => void;
	onOpenWindowMenu: () => void;
	displayMenuOpen: boolean;
	windowMenuOpen: boolean;
	devicesOpen: boolean;
	onToggleDevices: () => void;
	hasMicActive: boolean;
	hasCameraActive: boolean;
	hasSystemAudioActive: boolean;
	onOpenTeleprompter: () => void;
	onOpenRecordings: () => void;
	onOpenScreenshots: () => void;
	recordingsOpen: boolean;
	screenshotsOpen: boolean;
	onOpenSettings: () => void;
	onOpenHelp: () => void;
	onOpenBugReport: () => void;
	onHide: () => void;
	isRecording: boolean;
}

export const ControlDock: Component<ControlDockProps> = (props) => {
	return (
		<div class="flex flex-col w-full select-none bg-transparent">
			<div
				class="flex items-center justify-center w-full h-5 cursor-grab active:cursor-grabbing bg-transparent"
				data-tauri-drag-region
				title="Drag Scrinx"
			>
				<div
					class="flex items-center justify-center px-4 py-0.5 rounded-full hover:bg-gray-4/40 transition-colors"
					data-tauri-drag-region
				>
					<IconLucideGripHorizontal
						class="size-3.5 text-gray-10 hover:text-gray-12"
						data-tauri-drag-region
					/>
				</div>
			</div>

			<div class="flex items-center justify-between gap-1.5 px-3 py-2 mx-auto w-fit max-w-full rounded-2xl border border-gray-6/60 bg-gray-2/95 dark:bg-[#12261f]/95 backdrop-blur-md shadow-lg">
				<div class="flex items-center gap-1.5 shrink-0">
					<div
						class="flex items-center justify-center size-8 rounded-xl border border-primary/40 bg-primary/10 text-primary font-mono font-bold text-xs shadow-xs shrink-0"
						title="Scrinx Linux Studio"
					>
						S
					</div>

					<div class="flex items-center p-0.5 rounded-xl border border-gray-5/70 bg-gray-3/80 shrink-0">
						<Tooltip content={<span>Studio Recording Mode</span>}>
							<button
								type="button"
								disabled={props.isRecording}
								onClick={() => props.onModeChange("studio")}
								class={cx(
									"flex items-center justify-center size-7 rounded-lg transition-all shrink-0",
									props.mode === "studio"
										? "bg-primary text-primary-foreground font-semibold shadow-xs"
										: "text-gray-11 hover:text-gray-12 hover:bg-gray-4/50",
								)}
								aria-label="Studio mode"
							>
								<IconLucideVideo class="size-3.5" />
							</button>
						</Tooltip>

						<Tooltip content={<span>Screenshot Mode</span>}>
							<button
								type="button"
								disabled={props.isRecording}
								onClick={() => props.onModeChange("screenshot")}
								class={cx(
									"flex items-center justify-center size-7 rounded-lg transition-all shrink-0",
									props.mode === "screenshot"
										? "bg-primary text-primary-foreground font-semibold shadow-xs"
										: "text-gray-11 hover:text-gray-12 hover:bg-gray-4/50",
								)}
								aria-label="Screenshot mode"
							>
								<IconLucideImage class="size-3.5" />
							</button>
						</Tooltip>
					</div>
				</div>

				<div class="h-6 w-px bg-gray-6/60 shrink-0" />

				<div class="flex items-center gap-1 shrink-0">
					<div
						class={cx(
							"flex items-center rounded-xl border transition-all shrink-0",
							props.targetMode === "display" || props.displayMenuOpen
								? "border-primary/60 bg-primary/15 text-primary"
								: "border-gray-5/60 bg-gray-3/40 text-gray-12 hover:border-gray-7 hover:bg-gray-4/50",
						)}
					>
						<button
							type="button"
							disabled={props.isRecording}
							onClick={() => props.onSelectTarget("display")}
							class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium focus:outline-hidden whitespace-nowrap"
							title={
								props.mode === "studio"
									? "Record Display"
									: "Capture Display Screenshot"
							}
						>
							<IconMdiMonitor class="size-3.5 shrink-0" />
							<span>Display</span>
						</button>
						<button
							type="button"
							disabled={props.isRecording}
							onClick={props.onOpenDisplayMenu}
							aria-label="Choose Display"
							class={cx(
								"flex items-center justify-center px-1.5 py-2 border-l border-gray-5/50 text-gray-10 hover:text-gray-12 hover:bg-gray-5/40 rounded-r-xl shrink-0",
								props.displayMenuOpen && "bg-gray-5/60 text-primary",
							)}
						>
							<IconLucideChevronDown class="size-3" />
						</button>
					</div>

					<div
						class={cx(
							"flex items-center rounded-xl border transition-all shrink-0",
							props.targetMode === "window" || props.windowMenuOpen
								? "border-primary/60 bg-primary/15 text-primary"
								: "border-gray-5/60 bg-gray-3/40 text-gray-12 hover:border-gray-7 hover:bg-gray-4/50",
						)}
					>
						<button
							type="button"
							disabled={props.isRecording}
							onClick={() => props.onSelectTarget("window")}
							class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium focus:outline-hidden whitespace-nowrap"
							title={
								props.mode === "studio"
									? "Record Window"
									: "Capture Window Screenshot"
							}
						>
							<IconLucideAppWindowMac class="size-3.5 shrink-0" />
							<span>Window</span>
						</button>
						<button
							type="button"
							disabled={props.isRecording}
							onClick={props.onOpenWindowMenu}
							aria-label="Choose Window"
							class={cx(
								"flex items-center justify-center px-1.5 py-2 border-l border-gray-5/50 text-gray-10 hover:text-gray-12 hover:bg-gray-5/40 rounded-r-xl shrink-0",
								props.windowMenuOpen && "bg-gray-5/60 text-primary",
							)}
						>
							<IconLucideChevronDown class="size-3" />
						</button>
					</div>

					<button
						type="button"
						disabled={props.isRecording}
						onClick={() => props.onSelectTarget("area")}
						class={cx(
							"flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all focus:outline-hidden shrink-0 whitespace-nowrap",
							props.targetMode === "area"
								? "border-primary/60 bg-primary/15 text-primary"
								: "border-gray-5/60 bg-gray-3/40 text-gray-12 hover:border-gray-7 hover:bg-gray-4/50",
						)}
						title={
							props.mode === "studio"
								? "Record Custom Area"
								: "Capture Custom Area Screenshot"
						}
					>
						<IconLucideCrop class="size-3.5 shrink-0" />
						<span>Area</span>
					</button>
				</div>

				<div class="h-6 w-px bg-gray-6/60 shrink-0" />

				<div class="flex items-center gap-1 shrink-0">
					<Tooltip content={<span>Camera & Audio Devices</span>}>
						<button
							type="button"
							onClick={props.onToggleDevices}
							class={cx(
								"relative flex items-center justify-center size-8 rounded-xl border transition-all shrink-0",
								props.devicesOpen
									? "border-primary/60 bg-primary/15 text-primary"
									: "border-gray-5/60 bg-gray-3/40 text-gray-11 hover:text-gray-12 hover:bg-gray-4/50",
							)}
							aria-label="Devices settings"
						>
							<IconLucideSliders class="size-3.5" />
							<Show
								when={
									props.hasMicActive ||
									props.hasCameraActive ||
									props.hasSystemAudioActive
								}
							>
								<span class="absolute top-1 right-1 size-1.5 rounded-full bg-primary" />
							</Show>
						</button>
					</Tooltip>

					<Tooltip content={<span>Open Teleprompter</span>}>
						<button
							type="button"
							onClick={props.onOpenTeleprompter}
							class="flex items-center justify-center size-8 rounded-xl border border-gray-5/60 bg-gray-3/40 text-gray-11 hover:text-gray-12 hover:bg-gray-4/50 transition-all shrink-0"
							aria-label="Open Teleprompter"
						>
							<IconLucideScanText class="size-3.5" />
						</button>
					</Tooltip>

					<Tooltip content={<span>Media Library</span>}>
						<button
							type="button"
							onClick={
								props.mode === "screenshot"
									? props.onOpenScreenshots
									: props.onOpenRecordings
							}
							class={cx(
								"flex items-center justify-center size-8 rounded-xl border transition-all shrink-0",
								props.recordingsOpen || props.screenshotsOpen
									? "border-primary/60 bg-primary/15 text-primary"
									: "border-gray-5/60 bg-gray-3/40 text-gray-11 hover:text-gray-12 hover:bg-gray-4/50",
							)}
							aria-label="Media library"
						>
							<IconLucideSquarePlay class="size-3.5" />
						</button>
					</Tooltip>

					<Popover placement="bottom-end">
						<Popover.Trigger
							class="flex items-center justify-center size-8 rounded-xl border border-gray-5/60 bg-gray-3/40 text-gray-11 hover:text-gray-12 hover:bg-gray-4/50 transition-all focus:outline-hidden shrink-0"
							aria-label="More options"
						>
							<IconLucideMoreHorizontal class="size-3.5" />
						</Popover.Trigger>
						<Popover.Portal>
							<Popover.Content class="z-50 min-w-44 p-1.5 rounded-xl border border-gray-6 bg-gray-2 dark:bg-[#12261f] shadow-xl text-xs flex flex-col gap-0.5">
								<button
									type="button"
									onClick={props.onOpenSettings}
									class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-gray-11 hover:text-gray-12 hover:bg-gray-4/50 text-left transition-colors"
								>
									<IconLucideSettings class="size-3.5" />
									<span>Settings</span>
								</button>
								<button
									type="button"
									onClick={props.onOpenHelp}
									class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-gray-11 hover:text-gray-12 hover:bg-gray-4/50 text-left transition-colors"
								>
									<IconLucideCircleHelp class="size-3.5" />
									<span>Help & Manual</span>
								</button>
								<button
									type="button"
									onClick={props.onOpenBugReport}
									class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-gray-11 hover:text-gray-12 hover:bg-gray-4/50 text-left transition-colors"
								>
									<IconLucideBug class="size-3.5 text-secondary" />
									<span>Report a Bug</span>
								</button>
							</Popover.Content>
						</Popover.Portal>
					</Popover>

					<Tooltip content={<span>Hide Scrinx (Runs in Tray)</span>}>
						<button
							type="button"
							onClick={props.onHide}
							class="flex items-center justify-center size-8 rounded-xl border border-gray-5/60 bg-gray-3/40 text-gray-11 hover:text-secondary hover:border-secondary/40 hover:bg-secondary/10 transition-all shrink-0"
							aria-label="Hide panel"
						>
							<IconLucideX class="size-3.5" />
						</button>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};

export default ControlDock;

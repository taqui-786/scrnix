import { Button } from "@cap/ui-solid";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { ErrorBoundary, type ParentProps } from "solid-js";
import Titlebar from "./titlebar/Titlebar";

export function CapErrorBoundary(props: ParentProps) {
	return (
		<ErrorBoundary
			fallback={(e: Error) => {
				console.error(e);
				const windowLabel = getCurrentWebviewWindow().label;
				try {
					const errorMsg = `[WINDOW: ${windowLabel}] ${e.toString()}\n\n${e.stack}\n`;
					import("@tauri-apps/plugin-fs")
						.then(({ writeTextFile }) => {
							void writeTextFile("/tmp/scrinx_error.txt", errorMsg);
						})
						.catch(() => {});
				} catch {}
				const showTitlebar =
					[
						"main",
						"settings",
						"upgrade",
						"mode-select",
						"onboarding",
						"teleprompter",
					].includes(windowLabel) ||
					/^(editor|screenshot-editor)-\d+$/.test(windowLabel);
				return (
					<div class="w-full h-full flex flex-col bg-gray-2 max-h-screen overflow-auto p-2 select-text text-left">
						{showTitlebar && <Titlebar />}
						<div class="flex flex-col flex-1 min-h-0 justify-start items-start text-(--text-secondary) gap-y-1">
							<div class="text-xs font-bold text-red-500">
								[{windowLabel}] {e.toString()}
							</div>
							<div class="text-[10px] text-gray-11 font-mono whitespace-pre-wrap max-h-24 overflow-auto w-full">
								{e.stack}
							</div>
							<div class="flex flex-row gap-2 mt-1">
								<Button
									size="sm"
									onClick={() => {
										writeText(`[${windowLabel}] ${e.toString()}\n\n${e.stack}`);
									}}
								>
									Copy Error
								</Button>
								<Button
									size="sm"
									onClick={() => {
										location.reload();
									}}
									variant="gray"
								>
									Reload
								</Button>
								<Button
									size="sm"
									onClick={() => getCurrentWebviewWindow().close()}
									variant="destructive"
								>
									Close
								</Button>
							</div>
						</div>
					</div>
				);
			}}
		>
			{props.children}
		</ErrorBoundary>
	);
}

import { type RouteSectionProps, useLocation } from "@solidjs/router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { type as ostype } from "@tauri-apps/plugin-os";
import { cx } from "cva";
import {
	createEffect,
	onCleanup,
	onMount,
	type ParentProps,
	Suspense,
} from "solid-js";

import { AbsoluteInsetLoader } from "~/components/Loader";
import CaptionControlsMacOS from "~/components/titlebar/controls/CaptionControlsMacOS";
import CaptionControlsWindows11 from "~/components/titlebar/controls/CaptionControlsWindows11";
import { applyMacOSWindowMaterial } from "~/utils/macos-window-material";
import {
	useWindowChromeContext,
	WindowChromeContext,
} from "./(window-chrome)/Context";

export default function (props: RouteSectionProps) {
	const location = useLocation();

	const handleKeyDown = (e: KeyboardEvent) => {
		const isMac = ostype() === "macos";
		const closeShortcut = isMac
			? e.metaKey && e.key === "w"
			: e.ctrlKey && e.key === "w";

		if (closeShortcut) {
			e.preventDefault();
			getCurrentWindow().close();
		}
	};

	onMount(() => {
		window.addEventListener("keydown", handleKeyDown);
	});

	onCleanup(() => {
		window.removeEventListener("keydown", handleKeyDown);
	});

	const isMacOS = ostype() === "macos";

	createEffect(() => {
		void applyMacOSWindowMaterial(
			location.pathname.startsWith("/settings") ? "settings" : "panel",
		).catch((error) => {
			console.error("Failed to apply macOS window material:", error);
		});

		const isMain = location.pathname === "/";
		if (isMain) {
			document.documentElement.setAttribute("data-transparent-window", "true");
			document.documentElement.style.setProperty(
				"background",
				"transparent",
				"important",
			);
			document.documentElement.style.setProperty(
				"background-color",
				"transparent",
				"important",
			);
			document.body.style.setProperty("background", "transparent", "important");
			document.body.style.setProperty(
				"background-color",
				"transparent",
				"important",
			);
		} else {
			document.documentElement.removeAttribute("data-transparent-window");
			document.documentElement.style.removeProperty("background");
			document.documentElement.style.removeProperty("background-color");
			document.body.style.removeProperty("background");
			document.body.style.removeProperty("background-color");
		}
	});

	return (
		<WindowChromeContext>
			<div
				class={cx(
					"cap-window-shell flex overflow-hidden flex-col w-screen h-screen max-h-screen",
					location.pathname === "/"
						? "bg-transparent border-0"
						: "divide-y divide-gray-5 bg-gray-1",
					isMacOS && location.pathname !== "/" && "rounded-[16px]",
				)}
			>
				<Header />

				{/* breaks sometimes */}
				{/* <Transition
        mode="outin"
        enterActiveClass="transition-opacity duration-100"
        exitActiveClass="transition-opacity duration-100"
        enterClass="opacity-0"
        exitToClass="opacity-0"
        > */}
				<Suspense fallback={<AbsoluteInsetLoader />}>
					<Inner>
						<Suspense fallback={null}>{props.children}</Suspense>
					</Inner>
				</Suspense>
				{/* </Transition> */}
			</div>
		</WindowChromeContext>
	);
}

function Header() {
	const ctx = useWindowChromeContext();
	const location = useLocation();
	if (!ctx)
		throw new Error(
			"useWindowChrome must be used within a WindowChromeContext",
		);

	const isWindows = ostype() === "windows";
	const isMacOS = ostype() === "macos";
	const isLinux = ostype() === "linux";
	const isSettings = () => location.pathname.startsWith("/settings");

	if (isMacOS && isSettings()) return null;
	if (location.pathname === "/") return null;

	return (
		<header
			class={cx(
				"cap-window-header flex items-center min-w-0 w-full h-9 select-none shrink-0 bg-gray-2",
				isWindows ? "flex-row" : "flex-row-reverse",
			)}
			data-tauri-drag-region
		>
			{ctx.state()?.items}
			{isWindows && (
				<CaptionControlsWindows11
					class="ml-auto!"
					maximizable={ctx.state()?.onMaximize ? true : undefined}
					maximized={ctx.state()?.maximized}
					onMaximize={ctx.state()?.onMaximize}
				/>
			)}
			{((isMacOS && !isSettings()) || isLinux) && (
				<CaptionControlsMacOS
					class="mr-auto! ml-3"
					showMinimize={false}
					showZoom={ctx.state()?.onMaximize !== undefined}
					onZoom={ctx.state()?.onMaximize}
				/>
			)}
		</header>
	);
}

function Inner(props: ParentProps) {
	const location = useLocation();

	onMount(() => {
		void getCurrentWindow().show();
	});

	return (
		<div
			data-tauri-drag-region="false"
			class={cx(
				"cap-window-body flex overflow-hidden flex-col flex-1",
				location.pathname === "/" && "bg-transparent",
			)}
		>
			{props.children}
		</div>
	);
}

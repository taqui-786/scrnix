import { type RouteSectionProps, useLocation } from "@solidjs/router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { cx } from "cva";
import {
	createEffect,
	onCleanup,
	onMount,
	type ParentProps,
	Suspense,
} from "solid-js";

import { AbsoluteInsetLoader } from "~/components/Loader";
import CaptionControlsLinux from "~/components/titlebar/controls/CaptionControlsLinux";
import {
	useWindowChromeContext,
	WindowChromeContext,
} from "./(window-chrome)/Context";

export default function (props: RouteSectionProps) {
	const location = useLocation();

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.ctrlKey && e.key === "w") {
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

	createEffect(() => {
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
				)}
			>
				<Header />

				<Suspense fallback={<AbsoluteInsetLoader />}>
					<Inner>
						<Suspense fallback={null}>{props.children}</Suspense>
					</Inner>
				</Suspense>
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

	if (location.pathname === "/") return null;

	return (
		<header class="cap-window-header flex items-center justify-between min-w-0 w-full h-9 select-none shrink-0 bg-gray-2 px-3 border-b border-black-transparent-5">
			<div class="flex items-center min-w-0">{ctx.state()?.items}</div>
			<div data-tauri-drag-region class="flex-1 h-full cursor-default" />
			<CaptionControlsLinux
				class="ml-auto"
				showMinimize={true}
				showMaximize={ctx.state()?.onMaximize !== undefined}
				onMaximize={ctx.state()?.onMaximize}
			/>
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

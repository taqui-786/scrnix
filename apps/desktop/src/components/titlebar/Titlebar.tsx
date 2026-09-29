import { cx } from "cva";
import { type ComponentProps, splitProps } from "solid-js";
import titlebarState from "~/utils/titlebar-state";
import CaptionControlsLinux from "./controls/CaptionControlsLinux";

export default function Titlebar() {
	return (
		<header
			class={cx(
				"flex flex-row items-center select-none space-x-1 shrink-0 border-gray-1",
				titlebarState.backgroundColor
					? titlebarState.backgroundColor
					: titlebarState.transparent
						? "bg-transparent"
						: "bg-gray-2",
				titlebarState.border ? "border-b border-b-black-transparent-5" : "",
			)}
			style={{
				height: titlebarState.height,
			}}
			data-tauri-drag-region
		>
			<div data-tauri-drag-region class="flex items-center min-w-0">
				{titlebarState.items}
			</div>
			<WindowControls class="ml-auto!" />
		</header>
	);
}

export function WindowControls(props: ComponentProps<"div">) {
	const [local, otherProps] = splitProps(props, ["class"]);

	return (
		<CaptionControlsLinux
			class={`flex ml-auto ${local.class ?? ""}`}
			{...otherProps}
		/>
	);
}

// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
	<StartServer
		document={({ assets, children, scripts }) => (
			<html lang="en" class="overflow-hidden h-full">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="icon" type="image/svg+xml" href="/assets/logo.svg" />
					<script
						innerHTML={`
							(function() {
								var theme = null;
								try { theme = localStorage.getItem('cap-theme'); } catch (e) {}
								var isDark = theme === 'dark' ||
									(theme !== 'light' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
								if (isDark) document.documentElement.classList.add('dark');
								if (typeof location !== 'undefined' && (
									location.pathname === '/' ||
									location.pathname === '' ||
									location.pathname.startsWith('/target-select-overlay') ||
									location.pathname.startsWith('/capture-area') ||
									location.pathname.startsWith('/window-capture-occluder') ||
									location.pathname.startsWith('/recordings-overlay') ||
									location.pathname.startsWith('/in-progress-recording') ||
									location.pathname.startsWith('/teleprompter')
								)) {
									document.documentElement.setAttribute('data-transparent-window', 'true');
								}
							})();
						`}
					/>
					<style>
						{`
							html[data-transparent-window="true"],
							html[data-transparent-window="true"] body,
							html[data-transparent-window="true"] #app,
							[data-transparent-window="true"],
							[data-transparent-window="true"] body,
							[data-transparent-window="true"] #app {
								background: transparent !important;
								background-color: transparent !important;
							}
						`}
					</style>
					{assets}
				</head>
				<body class="w-screen h-screen cursor-default select-none">
					<div id="app" class="h-full text-(--text-primary)">
						{children}
					</div>
					{scripts}
				</body>
			</html>
		)}
	/>
));

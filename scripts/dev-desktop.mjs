import { spawn } from "node:child_process";

const tauri = spawn("bun", ["run", "tauri", "dev"], { stdio: "inherit" });

tauri.on("exit", (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
	} else {
		process.exit(code ?? 0);
	}
});

for (const signal of ["SIGINT", "SIGTERM"]) {
	process.on(signal, () => {
		tauri.kill(signal);
	});
}

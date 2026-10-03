@echo off
start /b cmd /c "bun run docker:up > nul" && timeout /t 5 /nobreak > nul && dotenv -e .env -- turbo run dev --filter=!@scrinx/chrome-extension --filter=!@scrinx/mobile --env-mode=loose --ui tui %*

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run build        # compile → minify → obfuscate → dist/
bun run type-check   # tsc --noEmit, no output files
```

Load `dist/` as an unpacked extension in Chrome: `chrome://extensions/` → Developer mode → Load unpacked.

## Environment

Copy `.env.example` to `.env` before building. All `URL_*` variables are injected at build time by esbuild's `define` — they are baked into the bundle as string literals and never loaded at runtime.

## Architecture

Two isolated browser contexts that communicate only via `chrome.runtime.sendMessage`:

- **`src/background.ts`** — MV3 service worker. Handles all window management: opens AI tools as Chrome popup windows (`type: "popup"`), tracks open windows in `Map<windowId, url>`, and deletes history entries on close. Calculates spawn position via `chrome.system.display` with a fallback to current window bounds.
- **`src/popup.ts`** — Extension popup UI. Reads position state locally, sends `OpenMiniMessage` to background, then immediately calls `window.close()`. Does no async work itself.
- **`src/types.ts`** — Shared types (`OpenMiniMessage`, `Position`) imported by both contexts.

## Build Pipeline

`build.ts` runs three sequential steps:

1. **esbuild** — bundles + minifies `src/popup.ts` and `src/background.ts` into `dist/`
2. **javascript-obfuscator** — post-processes minified output with `target: "browser-no-eval"` (MV3 CSP-safe, no `eval`), base64 string array encoding, hexadecimal identifier names
3. Copies `src/popup.html` and `src/manifest.json` to `dist/`

`tsconfig.json` is for IDE type-checking only — esbuild handles actual TS compilation.

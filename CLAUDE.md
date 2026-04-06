# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Setup

```bash
bun install
cp .env.example .env
```

## Commands

```bash
bun run build        # compile → minify → dist/
bun run check        # lint + format check (read-only)
bun run lint         # lint + format check with auto-fix
bun run type-check   # tsc --noEmit, no output files
```

Load `dist/` as an unpacked extension in Chrome: `chrome://extensions/` → Developer mode → Load unpacked.

## Environment

Copy `.env.example` to `.env` before building. All `URL_*` variables are injected at build time by esbuild's `define` — they are baked into the bundle as string literals and never loaded at runtime.

## Architecture

Two isolated browser contexts that communicate only via `chrome.runtime.sendMessage`:

- **`src/background.ts`** — MV3 service worker. Handles all window management: opens AI tools as Chrome popup windows (`type: "popup"`), tracks open windows in `Map<windowId, url>`, and deletes history entries on close. Calculates spawn position via `chrome.system.display` with a fallback to current window bounds.
- **`src/popup.ts`** — Extension popup UI. Reads position state locally, sends `OpenMiniMessage` to background, then immediately calls `window.close()`. Also handles the copy-page-text feature: executes a content script via `chrome.scripting.executeScript` to extract text from the active tab's main content area (`[role="main"]` or `main`, falling back to `body`). Images with real file extensions (`.jpg`, `.png`, etc.) are replaced inline as `[Gambar: <url>]`; theme icons (no extension) are removed. HTML is processed directly to preserve block-level formatting, then cleaned up with a separator (`----`) inserted before each question.
- **`src/types.ts`** — Shared types (`OpenMiniMessage`, `Position`) imported by both contexts.

## Build Pipeline

`build.ts` runs two sequential steps:

1. **esbuild** — bundles + minifies `src/popup.ts` and `src/background.ts` into `dist/`
2. Copies `src/popup.html` and `src/manifest.json` to `dist/`

`tsconfig.json` is for IDE type-checking only — esbuild handles actual TS compilation.

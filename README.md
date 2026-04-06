# Gem Chrome Extension

A Chrome extension that opens AI tools (ChatGPT, Claude, Gemini, Qwen, Grok, DeepSeek) as mini popup windows pinned to the corner of your screen, and copies the current page's text content (including inline image references) to clipboard.

## Features

- Open AI tools as mini popup windows pinned to the left or right of your screen
- **Copy page text** — extracts the main content of the active tab and copies it to clipboard:
  - Images with real file extensions (`.jpg`, `.png`, etc.) are included inline as `[Gambar: <url>]`
  - Theme/UI icons are filtered out
  - Block-level formatting is preserved; each question is separated by `----`
  - Shows "Tersalin!" feedback then resets, keeping the popup open

## Requirements

- [Bun](https://bun.sh) — runtime and package manager

## Setup

```bash
bun install
cp .env.example .env
```

Fill in `.env` with your AI chat URLs before building.

## Development

```bash
bun run build        # compile + minify → dist/
bun run check        # lint + format check (read-only)
bun run lint         # lint + format check with auto-fix
bun run type-check   # TypeScript type check only
```

## Load in Chrome

1. Run `bun run build`
2. Go to `chrome://extensions/`
3. Enable **Developer mode**
4. Click **Load unpacked** → select the `dist/` folder

## Project Structure

```
src/
├── background.ts   # Service worker: window management
├── popup.ts        # Popup UI + copy page text logic
├── popup.html      # Popup UI
├── manifest.json   # Extension manifest (MV3)
├── types.ts        # Shared types
└── env.d.ts        # process.env type declarations
build.ts            # Build script (esbuild → dist/)
biome.json          # Linter + formatter config
tsconfig.json       # TypeScript config (IDE/type-check only)
```

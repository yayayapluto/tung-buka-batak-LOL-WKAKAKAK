# Gem Chrome Extension

A Chrome extension that opens AI tools (ChatGPT, Claude, Gemini, Qwen, Grok, DeepSeek) as mini popup windows, pinned to the corner of your screen. Also supports copying the current page's text content to clipboard.

## Features

- Open AI tools (ChatGPT, Claude, Gemini, Qwen, Grok, DeepSeek) as mini popup windows pinned to the left or right of your screen
- **Copy page text** — copies the current tab's full text content to clipboard; shows "Tersalin!" feedback then resets, keeping the popup open so you can continue using other buttons

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
├── popup.ts        # Popup UI logic
├── popup.html      # Popup UI
├── manifest.json   # Extension manifest (MV3)
├── types.ts        # Shared types
└── env.d.ts        # process.env type declarations
build.ts            # Build script (esbuild → dist/)
biome.json          # Linter + formatter config
tsconfig.json       # TypeScript config (IDE/type-check only)
```

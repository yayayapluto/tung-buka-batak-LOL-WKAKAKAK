# Tung Chrome Extension

## How to Install

### 1. Build the extension

```bash
npm install
npm run build
```

This generates the extension files in the `dist/` folder.

### 2. Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `dist/` folder

The extension icon will appear in your Chrome toolbar.

### 3. Environment setup

Copy `.env.example` to `.env` and fill in the required values before building:

```bash
cp .env.example .env
```

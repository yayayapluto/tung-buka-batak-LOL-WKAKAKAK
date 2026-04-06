import type { OpenMiniMessage, Position } from "./types";

const WINDOW_SIZE = { width: 200, height: 300 } as const;
const trackedWindows = new Map<number, string>();

chrome.windows.onRemoved.addListener((windowId: number) => {
	const url = trackedWindows.get(windowId);
	if (url) {
		chrome.history.deleteUrl({ url });
		trackedWindows.delete(windowId);
	}
});

async function openMini(url: string, position: Position): Promise<void> {
	const windows = await chrome.windows.getAll({ windowTypes: ["popup"] });

	for (const win of windows) {
		const tabs = await chrome.tabs.query({ windowId: win.id });
		const origin = new globalThis.URL(url).origin;
		const match = tabs.find((t) => t.url?.startsWith(origin));
		if (match && win.id !== undefined) {
			await chrome.windows.update(win.id, { focused: true });
			return;
		}
	}

	const { left, top } = await getSpawnPosition(position);
	const newWin = await chrome.windows.create({
		...WINDOW_SIZE,
		type: "popup",
		url,
		left,
		top,
		focused: true,
	});

	if (!newWin?.id) return;
	await chrome.windows.update(newWin.id, { focused: true });
	trackedWindows.set(newWin.id, url);
}

async function getSpawnPosition(
	position: Position,
): Promise<{ left: number; top: number }> {
	try {
		const screens = await chrome.system.display.getInfo();
		const display = screens[0].workArea;
		const top = display.top + display.height - WINDOW_SIZE.height - 16;
		const left =
			position === "left"
				? display.left + 16
				: display.left + display.width - WINDOW_SIZE.width - 16;
		return { left, top };
	} catch {
		const win = await chrome.windows.getCurrent();
		const top = Math.max(
			0,
			(win.top ?? 0) + (win.height ?? 0) - WINDOW_SIZE.height - 16,
		);
		const left =
			position === "left"
				? Math.max(0, (win.left ?? 0) + 16)
				: Math.max(
						0,
						(win.left ?? 0) + (win.width ?? 0) - WINDOW_SIZE.width - 16,
					);
		return { left, top };
	}
}

chrome.runtime.onMessage.addListener(
	(message: OpenMiniMessage, sender: chrome.runtime.MessageSender) => {
		if (sender.id !== chrome.runtime.id) return;
		if (message.action === "openMini" && message.url && message.position) {
			openMini(message.url, message.position);
		}
	},
);

import type { OpenMiniMessage, Position } from "./types";

const CONFIGS: Record<string, string> = {
	chatgpt: process.env.URL_CHATGPT ?? "",
	claude: process.env.URL_CLAUDE ?? "",
	gemini: process.env.URL_GEMINI ?? "",
	qwen: process.env.URL_QWEN ?? "",
	grok: process.env.URL_GROK ?? "",
	deepseek: process.env.URL_DEEPSEEK ?? "",
};

let position: Position = "right";

function setPosition(pos: Position): void {
	position = pos;
	document
		.getElementById("posLeft")
		?.classList.toggle("active", pos === "left");
	document
		.getElementById("posRight")
		?.classList.toggle("active", pos === "right");
}

function openUrl(url: string): void {
	const message: OpenMiniMessage = { action: "openMini", url, position };
	chrome.runtime.sendMessage(message);
	window.close();
}

async function copyPageText(): Promise<void> {
	const btn = document.getElementById("btn-copy-page") as HTMLButtonElement;
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	if (!tab.id || !tab.url || /^(chrome|about|data|javascript):/.test(tab.url))
		return;

	const results = await chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: () => document.body.innerText,
	});

	const text = results[0]?.result;
	if (!text) return;

	await navigator.clipboard.writeText(text);
	btn.textContent = "Tersalin!";
	btn.classList.add("copied");
	setTimeout(() => window.close(), 800);
}

document
	.getElementById("posLeft")
	?.addEventListener("click", () => setPosition("left"));
document
	.getElementById("posRight")
	?.addEventListener("click", () => setPosition("right"));

document
	.getElementById("btn-copy-page")
	?.addEventListener("click", copyPageText);

for (const [key, url] of Object.entries(CONFIGS)) {
	document
		.getElementById(`btn-${key}`)
		?.addEventListener("click", () => openUrl(url));
}

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
	console.log(`[Gem] position button clicked: ${pos}`);
	position = pos;
	document
		.getElementById("posLeft")
		?.classList.toggle("active", pos === "left");
	document
		.getElementById("posRight")
		?.classList.toggle("active", pos === "right");
}

function openUrl(key: string, url: string): void {
	console.log(`[Gem] open button clicked: ${key}`, { url, position });
	const message: OpenMiniMessage = { action: "openMini", url, position };
	chrome.runtime.sendMessage(message);
	window.close();
}

async function copyPageText(): Promise<void> {
	console.log("[Gem] copy page button clicked");
	const btn = document.getElementById("btn-copy-page") as HTMLButtonElement;
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	if (!tab.id || !tab.url || /^(chrome|about|data|javascript):/.test(tab.url))
		return;

	const results = await chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: () => {
			// Scope to main content only — skips nav, sidebar, messaging panel
			const root = (document.querySelector('[role="main"]') ||
				document.querySelector("main") ||
				document.body) as HTMLElement;

			const clone = root.cloneNode(true) as HTMLElement;

			// Remove scripts and styles (detached clone may expose their text)
			clone
				.querySelectorAll("script,style")
				.forEach((el) => el.remove());

			// Keep only images with a real file extension (content images),
			// remove theme icons which are served as PHP without an extension
			clone.querySelectorAll("img").forEach((img) => {
				const src = (img as HTMLImageElement).src;
				if (/\.(jpe?g|png|gif|webp|bmp|svg)(\?|$)/i.test(src)) {
					img.parentNode?.replaceChild(
						document.createTextNode(`[Gambar: ${src}]`),
						img,
					);
				} else {
					img.remove();
				}
			});

			// Process HTML directly so block elements become newlines
			// (innerText on detached clones doesn't reliably do this)
			let html = clone.innerHTML;
			html = html.replace(/<br\s*\/?>/gi, "\n");
			html = html.replace(
				/<\/(p|div|h[1-6]|li|tr|section|article|blockquote)>/gi,
				"\n",
			);
			html = html.replace(/<[^>]+>/g, "");

			// Decode HTML entities safely via textarea
			const tmp = document.createElement("textarea");
			tmp.innerHTML = html;

			return tmp.value
				.split("\n")
				.map((line) => line.trim())
				.filter((line) => line !== "")
				.map((line) =>
					/^Question\s+\d+/i.test(line) ? `----\n${line}` : line,
				)
				.join("\n")
				.trim();
		},
	});

	const text = results[0]?.result;
	if (!text) return;

	await navigator.clipboard.writeText(text);
	btn.textContent = "Tersalin!";
	btn.classList.add("copied");
	setTimeout(() => {
		btn.textContent = "Salin Teks Halaman";
		btn.classList.remove("copied");
	}, 1500);
}

document
	.getElementById("posLeft")
	?.addEventListener("click", () => setPosition("left"));
document
	.getElementById("posRight")
	?.addEventListener("click", () => setPosition("right"));

async function savePageAsPdf(): Promise<void> {
	console.log("[Gem] save pdf button clicked");
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	if (!tab.id || !tab.url || /^(chrome|about|data|javascript):/.test(tab.url))
		return;

	await chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: () => window.print(),
	});
	window.close();
}

document
	.getElementById("btn-copy-page")
	?.addEventListener("click", copyPageText);

document
	.getElementById("btn-save-pdf")
	?.addEventListener("click", savePageAsPdf);

for (const [key, url] of Object.entries(CONFIGS)) {
	document
		.getElementById(`btn-${key}`)
		?.addEventListener("click", () => openUrl(key, url));
}

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { config } from "dotenv";
import * as esbuild from "esbuild";
import JavaScriptObfuscator from "javascript-obfuscator";

config();

mkdirSync("dist", { recursive: true });

const define: Record<string, string> = {};
for (const [key, value] of Object.entries(process.env)) {
	if (key.startsWith("URL_")) {
		define[`process.env.${key}`] = JSON.stringify(value ?? "");
	}
}

await esbuild.build({
	entryPoints: ["src/popup.ts", "src/background.ts"],
	outdir: "dist",
	bundle: true,
	minify: true,
	define,
});

const files = ["dist/popup.js", "dist/background.js"];
for (const file of files) {
	const code = readFileSync(file, "utf8");
	const result = JavaScriptObfuscator.obfuscate(code, {
		target: "browser-no-eval",
		compact: true,
		stringArray: true,
		stringArrayEncoding: ["base64"],
		stringArrayThreshold: 0.75,
		identifierNamesGenerator: "hexadecimal",
		selfDefending: false,
	});
	writeFileSync(file, result.getObfuscatedCode());
}

copyFileSync("src/popup.html", "dist/popup.html");
copyFileSync("src/manifest.json", "dist/manifest.json");

console.log("Build complete → dist/");

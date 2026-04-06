import { copyFileSync, mkdirSync } from "node:fs";
import { config } from "dotenv";
import * as esbuild from "esbuild";

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


copyFileSync("src/popup.html", "dist/popup.html");
copyFileSync("src/manifest.json", "dist/manifest.json");

console.log("Build complete → dist/");

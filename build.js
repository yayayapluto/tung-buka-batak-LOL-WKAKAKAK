import * as esbuild from "esbuild";
import { config } from "dotenv";
import { copyFileSync, mkdirSync } from "fs";

config();

mkdirSync("dist", { recursive: true });

const define = {};
for (const [key, value] of Object.entries(process.env)) {
  if (key.startsWith("URL_")) {
    define[`process.env.${key}`] = JSON.stringify(value ?? "");
  }
}

await esbuild.build({
  entryPoints: ["src/popup.js", "src/background.js"],
  outdir: "dist",
  bundle: true,
  define,
});

copyFileSync("src/popup.html", "dist/popup.html");
copyFileSync("src/manifest.json", "dist/manifest.json");

console.log("Build complete → dist/");

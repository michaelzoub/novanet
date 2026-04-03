import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "..", "novanet_site-32.html");
const outPath = path.join(__dirname, "..", "components", "hero", "heroRestoredBackgroundUrl.ts");

const s = fs.readFileSync(htmlPath, "utf8");
const re = /class="hbg" style="background-image:url\('([^']+)'\)"/;
const m = s.match(re);
if (!m) {
  console.error("Could not find .hbg background-image in novanet_site-32.html");
  process.exit(1);
}
const dataUrl = m[1];
const escaped = dataUrl.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

const ts = `/** Inline hero photo restored from \`novanet_site-32.html\` (original static asset). */
export const HERO_RESTORED_BACKGROUND_IMAGE_URL = \`${escaped}\` as const;
`;
fs.writeFileSync(outPath, ts, "utf8");
console.log("Wrote", outPath, "length", dataUrl.length);

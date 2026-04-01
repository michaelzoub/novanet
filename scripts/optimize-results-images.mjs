import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicDir = path.join(root, "public");
const outDir = path.join(publicDir, "results");

const sizes = [640, 960, 1280, 1600];

const pairs = [
  { in: "before1.jpeg", outBase: "before1" },
  { in: "after1.jpeg", outBase: "after1" },
  { in: "before2.jpeg", outBase: "before2" },
  { in: "after2.jpeg", outBase: "after2" },
  { in: "before3.jpeg", outBase: "before3" },
  { in: "after3.jpeg", outBase: "after3" },
];

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function buildOne(inputName, outBase) {
  const inputPath = path.join(publicDir, inputName);
  if (!(await fileExists(inputPath))) {
    throw new Error(`Missing input image: ${inputPath}`);
  }

  const img = sharp(inputPath, { failOn: "none" }).rotate();
  const meta = await img.metadata();
  const w0 = meta.width ?? 0;
  const h0 = meta.height ?? 0;
  if (!w0 || !h0) throw new Error(`Could not read metadata: ${inputName}`);

  for (const w of sizes) {
    const resize =
      w < w0
        ? img.clone().resize({ width: w, withoutEnlargement: true })
        : img.clone();

    const webpPath = path.join(outDir, `${outBase}-${w}.webp`);
    const avifPath = path.join(outDir, `${outBase}-${w}.avif`);

    await resize
      .clone()
      .webp({ quality: 76, effort: 4 })
      .toFile(webpPath);
    await resize
      .clone()
      .avif({ quality: 48, effort: 4 })
      .toFile(avifPath);
  }
}

async function main() {
  await ensureDir(outDir);
  for (const p of pairs) {
    // eslint-disable-next-line no-console
    console.log(`Optimizing ${p.in} -> ${p.outBase}-*.{webp,avif}`);
    await buildOne(p.in, p.outBase);
  }
}

await main();


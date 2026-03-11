/**
 * Generates assets/logo.png from public/favicon.png with safe-zone padding for Android.
 * The tower is scaled to ~66% and centered so it stays visible after Android's 16.7% adaptive icon inset.
 * Requires: npm install sharp (devDependency)
 */

import { readFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const faviconPath = join(root, "public", "favicon.png");
const assetsDir = join(root, "assets");
const logoPath = join(assetsDir, "logo.png");

// Safe zone: Android adaptive icons use 16.7% inset, so visible area is center ~66%.
// Tower at 72% fills the circle more while staying inside the safe zone.
const CANVAS_SIZE = 1024;
const TOWER_SIZE = Math.round(CANVAS_SIZE * 0.72);

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch (e) {
    console.error(
      "Missing dependency: run npm install --save-dev sharp"
    );
    process.exit(1);
  }

  if (!existsSync(faviconPath)) {
    console.error("Source not found:", faviconPath);
    process.exit(1);
  }

  if (!existsSync(assetsDir)) {
    mkdirSync(assetsDir, { recursive: true });
  }

  const faviconBuffer = readFileSync(faviconPath);
  const resizedTower = await sharp(faviconBuffer)
    .resize(TOWER_SIZE, TOWER_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: CANVAS_SIZE,
      height: CANVAS_SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: resizedTower, gravity: "center" }])
    .png()
    .toFile(logoPath);

  console.log("Generated", logoPath, `(${CANVAS_SIZE}x${CANVAS_SIZE}, tower at ${TOWER_SIZE}px in center)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

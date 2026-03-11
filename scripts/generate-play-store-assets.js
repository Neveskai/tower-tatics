/**
 * Generates Play Store assets from assets/logo.png:
 * - icon-512.png: 512×512 PNG (ícone do aplicativo na Play Store)
 * - feature-graphic.png: 1024×500 PNG (recurso gráfico / banner)
 *
 * Run after assets:android so assets/logo.png exists.
 * Requires: npm install sharp (devDependency)
 */

import { readFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const logoPath = join(root, "assets", "logo.png");
const outDir = join(root, "play-store");

// Play Store: ícone 512×512, PNG ou JPEG até 1 MB
const ICON_SIZE = 512;
// Recurso gráfico: 1024×500, PNG 24-bit (sem alpha)
const FEATURE_WIDTH = 1024;
const FEATURE_HEIGHT = 500;
const LOGO_HEIGHT_IN_FEATURE = 380; // logo height inside banner
// Cor de fundo do app (mesma do adaptive icon)
const BG = { r: 245, g: 240, b: 232 };

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch (e) {
    console.error("Missing dependency: run npm install --save-dev sharp");
    process.exit(1);
  }

  if (!existsSync(logoPath)) {
    console.error(
      "Source not found:",
      logoPath,
      "\nRun 'yarn assets:android' first to generate assets/logo.png"
    );
    process.exit(1);
  }

  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const logoBuffer = readFileSync(logoPath);

  // 1) Ícone 512×512 para a Play Store
  const iconPath = join(outDir, "icon-512.png");
  await sharp(logoBuffer)
    .resize(ICON_SIZE, ICON_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(iconPath);
  console.log("Generated", iconPath, `(${ICON_SIZE}×${ICON_SIZE})`);

  // 2) Recurso gráfico 1024×500 (fundo sólido + logo centralizado)
  const featurePath = join(outDir, "feature-graphic.png");
  const resizedLogo = await sharp(logoBuffer)
    .resize(null, LOGO_HEIGHT_IN_FEATURE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const meta = await sharp(resizedLogo).metadata();
  const x = Math.round((FEATURE_WIDTH - (meta.width || 0)) / 2);
  const y = Math.round((FEATURE_HEIGHT - (meta.height || 0)) / 2);

  await sharp({
    create: {
      width: FEATURE_WIDTH,
      height: FEATURE_HEIGHT,
      channels: 3,
      background: BG,
    },
  })
    .composite([{ input: resizedLogo, left: x, top: y }])
    .flatten({ background: BG })
    .png({ compressionLevel: 9 })
    .toFile(featurePath);
  console.log("Generated", featurePath, `(${FEATURE_WIDTH}×${FEATURE_HEIGHT})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

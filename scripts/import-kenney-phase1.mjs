#!/usr/bin/env node
/**
 * Copia meshes Kenney para tower-tatics-3D/assets/models/.
 * Gera Textures/colormap.png (o zip local não traz a paleta).
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const destDir = path.join(root, "..", "tower-tatics-3D", "assets", "models");

const PHASE1 = [
  "tile",
  "tile-dirt",
  "tile-spawn",
  "tile-spawn-end",
  "tile-straight",
  "selection-a",
  "tower-square-bottom-a",
  "tower-square-middle-a",
  "tower-square-roof-a",
  "weapon-ballista",
];

const DECORATIONS = [
  "detail-tree",
  "detail-tree-large",
  "detail-rocks",
  "detail-crystal",
];

const STANDINS = [
  "weapon-ammo-bullet",
  "enemy-ufo-a",
];

const KIT_CANDIDATES = [
  path.join(root, "..", "kenney_tower-defense-kit"),
  path.join(process.env.USERPROFILE || "", "Documents", "kenney_tower-defense-kit"),
  "C:\\Users\\Wendell\\Documents\\kenney_tower-defense-kit",
];

function findKit() {
  for (const base of KIT_CANDIDATES) {
    const objDir = path.join(base, "Models", "OBJ format");
    const glbDir = path.join(base, "Models", "GLB format");
    if (fs.existsSync(objDir) || fs.existsSync(glbDir)) {
      return { base, objDir, glbDir };
    }
  }
  return null;
}

function copyMesh(kit, name, required) {
  const destGlb = path.join(destDir, `${name}.glb`);
  const glbSrc = path.join(kit.glbDir, `${name}.glb`);
  if (fs.existsSync(glbSrc)) {
    fs.copyFileSync(glbSrc, destGlb);
    console.log("copied", `${name}.glb`);
    return true;
  }
  if (fs.existsSync(destGlb)) {
    console.log("keep existing", `${name}.glb`);
    return true;
  }
  const objSrc = path.join(kit.objDir, `${name}.obj`);
  const mtlSrc = path.join(kit.objDir, `${name}.mtl`);
  if (!fs.existsSync(objSrc)) {
    if (required) {
      console.error("missing mesh:", name);
      process.exit(1);
    }
    console.warn("skip missing", name);
    return false;
  }
  fs.copyFileSync(objSrc, path.join(destDir, `${name}.obj`));
  if (fs.existsSync(mtlSrc)) {
    let mtl = fs.readFileSync(mtlSrc, "utf8");
    mtl = mtl.replace(/map_Kd\s+.+/i, "map_Kd Textures/colormap.png");
    if (!/map_Kd/i.test(mtl)) {
      mtl += "\nmap_Kd Textures/colormap.png\n";
    }
    fs.writeFileSync(path.join(destDir, `${name}.mtl`), mtl);
  }
  console.log("copied", `${name}.obj`);
  return true;
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcBuf));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function lerp(a, b, t) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t));
}

function ramp(dark, light, cy, y0, y1) {
  if (y1 <= y0) return light;
  const t = Math.min(1, Math.max(0, (cy - y0) / (y1 - y0)));
  return lerp(dark, light, t);
}

function cellColor(cx, cy) {
  switch (cx) {
    case 1:
      if (cy >= 4 && cy <= 9) return ramp([158, 82, 36], [230, 158, 82], cy, 4, 9);
      return ramp([107, 61, 31], [178, 107, 51], cy, 0, 15);
    case 3:
      return ramp([184, 71, 41], [235, 122, 71], cy, 0, 15);
    case 5:
      if (cy <= 3) return ramp([46, 107, 158], [107, 184, 224], cy, 0, 3);
      if (cy >= 8) return ramp([133, 128, 158], [199, 194, 219], cy, 8, 15);
      return ramp([102, 122, 148], [158, 168, 189], cy, 4, 7);
    case 7:
      if (cy >= 8) return ramp([97, 41, 148], [168, 97, 219], cy, 8, 15);
      return ramp([71, 36, 107], [122, 71, 158], cy, 0, 7);
    case 8:
      return ramp([41, 82, 36], [71, 122, 56], cy, 0, 15);
    case 9:
      if (cy <= 3) return ramp([56, 56, 66], [97, 97, 107], cy, 0, 3);
      return ramp([82, 128, 41], [140, 199, 71], cy, 4, 15);
    case 11:
      if (cy >= 4 && cy <= 8) return ramp([51, 209, 235], [115, 242, 140], cy, 4, 8);
      return ramp([46, 140, 158], [102, 199, 184], cy, 0, 15);
    case 13:
      return ramp([209, 82, 26], [255, 158, 71], cy, 0, 15);
    case 15:
      if (cy <= 5) return ramp([209, 230, 245], [250, 252, 255], cy, 0, 5);
      return ramp([178, 199, 219], [230, 240, 250], cy, 6, 15);
    default:
      return ramp([102, 107, 92], [148, 153, 133], cy, 0, 15);
  }
}

function writeColormap(pngPath) {
  const size = 256;
  const cells = 16;
  const cell = size / cells;
  const raw = Buffer.alloc(size * (1 + size * 3));
  let o = 0;
  for (let y = 0; y < size; y++) {
    raw[o++] = 0;
    const cy = Math.floor(y / cell);
    for (let x = 0; x < size; x++) {
      const cx = Math.floor(x / cell);
      const [r, g, b] = cellColor(cx, cy);
      raw[o++] = r;
      raw[o++] = g;
      raw[o++] = b;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  fs.mkdirSync(path.dirname(pngPath), { recursive: true });
  fs.writeFileSync(pngPath, png);
  console.log("wrote", pngPath);
}

function findColormap(dir, depth = 0) {
  if (!dir || !fs.existsSync(dir) || depth > 5) {
    return null;
  }
  const direct = path.join(dir, "colormap.png");
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) {
    return direct;
  }
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return null;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const found = findColormap(path.join(dir, entry.name), depth + 1);
    if (found) {
      return found;
    }
  }
  return null;
}

function copyColormap(kit, destDir) {
  const dest = path.join(destDir, "Textures", "colormap.png");
  const sources = [
    path.join(kit.glbDir, "Textures", "colormap.png"),
    path.join(kit.base, "Models", "FBX format", "Textures", "colormap.png"),
    path.join(kit.objDir, "Textures", "colormap.png"),
    findColormap(kit.base),
  ].filter(Boolean);
  for (const src of sources) {
    if (src === dest) continue;
    if (fs.existsSync(src)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      console.log("copied colormap", src);
      return true;
    }
  }
  if (fs.existsSync(dest)) {
    console.log("keep existing colormap", dest);
    return true;
  }
  writeColormap(dest);
  return false;
}

const kit = findKit();
if (!kit) {
  console.error("Kenney kit not found. Tried:\n" + KIT_CANDIDATES.join("\n"));
  process.exit(1);
}

fs.mkdirSync(destDir, { recursive: true });
copyColormap(kit, destDir);

let copied = 0;
for (const name of PHASE1) {
  if (copyMesh(kit, name, true)) copied += 1;
}
let deco = 0;
for (const name of DECORATIONS) {
  if (copyMesh(kit, name, false)) deco += 1;
}
let standins = 0;
for (const name of STANDINS) {
  if (copyMesh(kit, name, false)) standins += 1;
}

console.log(
  `Done. ${copied}/${PHASE1.length} core, ${deco}/${DECORATIONS.length} props, ${standins}/${STANDINS.length} stand-ins from ${kit.base}`,
);

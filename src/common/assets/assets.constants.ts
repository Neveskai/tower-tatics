import { getAssetUrl } from "./get-asset-url";
import { TowerTypes } from "@/common/enum/tower-types";

/** Number of rotation frames per tower (10° steps: 360/36); must match Blender ROTATION_FRAMES. */
export const ROTATION_FRAMES = 36;

/** Tower types that use rotation frames (Cannon, Machine_Gun, Heavy_Gun, Electric). */
export const TOWER_TYPES_WITH_ROTATION: TowerTypes[] = [
  TowerTypes.MACHINE_GUN,
  TowerTypes.MISSILE,
  TowerTypes.HEAVY_GUN,
  TowerTypes.ELECTRIC,
];

const ROTATION_LABEL_BY_TYPE: Record<TowerTypes, string> = {
  [TowerTypes.MACHINE_GUN]: "Machine_Gun",
  [TowerTypes.MISSILE]: "Cannon",
  [TowerTypes.HEAVY_GUN]: "Heavy_Gun",
  [TowerTypes.ELECTRIC]: "Electric",
  [TowerTypes.ANTI_AIR]: "",
  [TowerTypes.FREEZE]: "",
};

function buildRotationFrameAliases(): Record<string, { alias: string; src: string }> {
  const out: Record<string, { alias: string; src: string }> = {};
  for (const type of TOWER_TYPES_WITH_ROTATION) {
    const label = ROTATION_LABEL_BY_TYPE[type];
    for (let i = 0; i < ROTATION_FRAMES; i++) {
      const alias = `${type}-${i}`;
      const pad = i < 10 ? `0${i}` : String(i);
      out[alias] = {
        alias,
        src: getAssetUrl(`/assets/frames/towers/${label}_${pad}.png`),
      };
    }
  }
  return out;
}

export const ROTATION_FRAME_ASSETS = buildRotationFrameAliases();

export const monsters = [
  "slime",
  "goblin",
  "wolf",
  "bee",
  "plant",
  "plantZombie",
  "plantFire",
  "orc",
  "orcLord",
  "slimeBoned",
  "slimeVulcan",
];
export const directions = ["D", "S", "U"];
export const actions = ["Death", "Walk"];

export const AssetsMap = {
  freeze: {
    alias: "freeze",
    src: getAssetUrl('/assets/frames/towers/Freeze.png'),
  },
  electric: {
    alias: "electric",
    src: getAssetUrl('/assets/frames/towers/Electric.png'),
  },
  "tower-base": {
    alias: "tower-base",
    src: getAssetUrl('/assets/frames/towers/Tower.png'),
  },
  "tower-base-square-a": {
    alias: "tower-base-square-a",
    src: getAssetUrl('/assets/frames/towers/Tower_square_a.png'),
  },
  "tower-base-square-b": {
    alias: "tower-base-square-b",
    src: getAssetUrl('/assets/frames/towers/Tower_square_b.png'),
  },
  "tower-base-square-c": {
    alias: "tower-base-square-c",
    src: getAssetUrl('/assets/frames/towers/Tower_square_c.png'),
  },
  "tower-base-round-a": {
    alias: "tower-base-round-a",
    src: getAssetUrl('/assets/frames/towers/Tower_round_a.png'),
  },
  "tower-base-round-b": {
    alias: "tower-base-round-b",
    src: getAssetUrl('/assets/frames/towers/Tower_round_b.png'),
  },
  "tower-base-round-c": {
    alias: "tower-base-round-c",
    src: getAssetUrl('/assets/frames/towers/Tower_round_c.png'),
  },
  "machine-gun": {
    alias: "machine-gun",
    src: getAssetUrl('/assets/frames/towers/Machine_Gun.png'),
  },
  missile: {
    alias: "missile",
    src: getAssetUrl('/assets/frames/towers/Cannon.png'),
  },
  "anti-air": {
    alias: "anti-air",
    src: getAssetUrl('/assets/frames/towers/Anti_Air.png'),
  },
  "heavy-gun": {
    alias: "heavy-gun",
    src: getAssetUrl('/assets/frames/towers/Heavy_Gun.png'),
  },
  "bullet-mg": {
    alias: "bullet-mg",
    src: getAssetUrl('/assets/frames/towers/Bullet_MG.png'),
  },
  "bullet-anti-air": {
    alias: "bullet-anti-air",
    src: getAssetUrl('/assets/frames/towers/Bullet_AntiAir.webp'),
  },
  "bullet-missile": {
    alias: "bullet-missile",
    src: getAssetUrl('/assets/frames/towers/Bullet_Missile.png'),
  },
  snowflake: {
    alias: "snowflake",
    src: getAssetUrl('/assets/frames/snowflake.webp'),
  },
  bolt: {
    alias: "bolt",
    src: getAssetUrl('/assets/frames/bolt.webp'),
  },
  "badge-icon": {
    alias: "badge-icon",
    src: getAssetUrl('/assets/icons/badge-icon.webp'),
  },
  "star-icon": {
    alias: "star-icon",
    src: getAssetUrl('/assets/icons/star-icon.webp'),
  },
  tile: {
    alias: "tile",
    src: getAssetUrl('/assets/frames/tiles/tile.png'),
  },
  "tile-dirt": {
    alias: "tile-dirt",
    src: getAssetUrl('/assets/frames/tiles/tile-dirt.png'),
  },
  "tile-bump": {
    alias: "tile-bump",
    src: getAssetUrl('/assets/frames/tiles/tile-bump.png'),
  },
  "tile-straight": {
    alias: "tile-straight",
    src: getAssetUrl('/assets/frames/tiles/tile-straight.png'),
  },
  "tile-crossing": {
    alias: "tile-crossing",
    src: getAssetUrl('/assets/frames/tiles/tile-crossing.png'),
  },
  "tile-corner-square": {
    alias: "tile-corner-square",
    src: getAssetUrl('/assets/frames/tiles/tile-corner-square.png'),
  },
  "tile-corner-inner": {
    alias: "tile-corner-inner",
    src: getAssetUrl('/assets/frames/tiles/tile-corner-inner.png'),
  },
  "tile-corner-outer": {
    alias: "tile-corner-outer",
    src: getAssetUrl('/assets/frames/tiles/tile-corner-outer.png'),
  },
  "tile-corner-round": {
    alias: "tile-corner-round",
    src: getAssetUrl('/assets/frames/tiles/tile-corner-round.png'),
  },
  ...ROTATION_FRAME_ASSETS,
};

/** Base sprite key per tower type (cada torre com base diferente). */
export const TOWER_BASE_BY_TYPE: Record<TowerTypes, keyof typeof AssetsMap> = {
  [TowerTypes.MACHINE_GUN]: "tower-base-square-a",
  [TowerTypes.HEAVY_GUN]: "tower-base-square-b",
  [TowerTypes.MISSILE]: "tower-base-square-c",
  [TowerTypes.ANTI_AIR]: "tower-base-round-a",
  [TowerTypes.FREEZE]: "tower-base-round-b",
  [TowerTypes.ELECTRIC]: "tower-base-round-c",
};

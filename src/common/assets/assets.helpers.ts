import { TowerTypes } from "@/common/enum/tower-types";
import {
  ROTATION_FRAMES,
  TOWER_TYPES_WITH_ROTATION,
  AssetsMap,
  TOWER_BASE_BY_TYPE,
} from "./assets.constants";

export function getTowerRotationFrameAliases(type: TowerTypes): string[] | undefined {
  if (!TOWER_TYPES_WITH_ROTATION.includes(type)) return undefined;
  return Array.from(
    { length: ROTATION_FRAMES },
    (_, i) => `${type}-${i}`
  );
}

export function getTowerBaseAssetKey(type: TowerTypes): keyof typeof AssetsMap {
  return TOWER_BASE_BY_TYPE[type];
}

import { TowerTypes } from "@/common/enum/tower-types";
import { TowerConfigs } from "@/Game/common/constants/towers.constants";
import type { TowerConfig } from "./catalog.types";
import { FALLBACK_TOWER_ORDER, I18N_KEYS } from "./catalog-fallback.constants";

export function getFallbackTowerConfigs(): Record<TowerTypes, TowerConfig> {
  const result = {} as Record<TowerTypes, TowerConfig>;

  for (const id of FALLBACK_TOWER_ORDER) {
    const raw = TowerConfigs[id as keyof typeof TowerConfigs];
    if (!raw) continue;

    result[id] = {
      id,
      bulletSpeed: raw.bulletSpeed,
      bulletSize: raw.bulletSize,
      bulletAsset: raw.bulletAsset,
      range: raw.range,
      attackSpeed: raw.attackSpeed,
      attackDamage: raw.attackDamage,
      AoE: raw.AoE,
      cost: raw.cost,
      attackAir: raw.attackAir,
      attackTerrain: raw.attackTerrain,
      special: raw.special,
      sell_prices: raw.sell_prices,
      upgrades: raw.upgrades,
    };
  }

  return result;
}

/** Ordered list of tower IDs for display (fallback) */
export function getFallbackTowerOrder(): TowerTypes[] {
  return [...FALLBACK_TOWER_ORDER];
}

/** i18n key for tower name (fallback) */
export function getFallbackTowerI18nKey(id: TowerTypes): string {
  return I18N_KEYS[id] ?? id;
}

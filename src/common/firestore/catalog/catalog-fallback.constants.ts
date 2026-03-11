import { TowerTypes } from "@/common/enum/tower-types";

/** Stable array for fallback - use when catalog not yet loaded to avoid new refs each render */
export const FALLBACK_TOWER_ORDER: readonly TowerTypes[] = [
  TowerTypes.MACHINE_GUN,
  TowerTypes.MISSILE,
  TowerTypes.HEAVY_GUN,
  TowerTypes.ELECTRIC,
  TowerTypes.FREEZE,
  TowerTypes.ANTI_AIR,
];

export const I18N_KEYS: Record<TowerTypes, string> = {
  [TowerTypes.MACHINE_GUN]: "turretMachineGun",
  [TowerTypes.MISSILE]: "turretCannon",
  [TowerTypes.HEAVY_GUN]: "turretHeavyGun",
  [TowerTypes.ELECTRIC]: "turretElectric",
  [TowerTypes.FREEZE]: "turretFreeze",
  [TowerTypes.ANTI_AIR]: "turretAntiAir",
};

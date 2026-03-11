import { TowerTypes } from "@/common/enum/tower-types";

/**
 * Tower unlocked when the player completes each map (by map id).
 * Map 1 → MISSILE, 2 → HEAVY_GUN, 3 → ELECTRIC, 4 → FREEZE, 5 → ANTI_AIR.
 * MACHINE_GUN is the default starting tower and is not awarded.
 */
const MAP_ID_TO_TOWER: Record<number, TowerTypes> = {
  1: TowerTypes.MISSILE,
  2: TowerTypes.HEAVY_GUN,
  3: TowerTypes.ELECTRIC,
  4: TowerTypes.FREEZE,
  5: TowerTypes.ANTI_AIR,
};

/**
 * Returns the tower type unlocked when the player completes the given map,
 * or null if this map has no tower reward.
 */
export function getTowerUnlockForMap(mapId: number): TowerTypes | null {
  return MAP_ID_TO_TOWER[mapId] ?? null;
}

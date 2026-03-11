import type { TowerTypes } from "@/common/enum/tower-types";

export interface TowerInventory {
  unlocked: TowerTypes[];
  equipped: TowerTypes[];
  discovered?: TowerTypes[];
}

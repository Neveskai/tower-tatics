import { TowerTypes } from "@/common/enum/tower-types";

export const DEFAULT_INITIAL_TOWER = TowerTypes.MACHINE_GUN;

export const TOWER_IMAGE_MAP: Record<TowerTypes, string> = {
  [TowerTypes.MACHINE_GUN]: "/assets/frames/towers/Machine_Gun.png",
  [TowerTypes.MISSILE]: "/assets/frames/towers/Cannon.png",
  [TowerTypes.HEAVY_GUN]: "/assets/frames/towers/Heavy_Gun.png",
  [TowerTypes.ELECTRIC]: "/assets/frames/towers/Electric.png",
  [TowerTypes.FREEZE]: "/assets/frames/towers/Freeze.png",
  [TowerTypes.ANTI_AIR]: "/assets/frames/towers/Anti_Air.png",
};

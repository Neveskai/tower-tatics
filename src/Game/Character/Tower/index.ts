export { MachineGunTower } from "./entities/machine-gun.entity";
export { CannonTower } from "./entities/cannon.entity";
export { HeavyGunTower } from "./entities/heavy-gun.entity";
export { ElectricTower } from "./entities/electric.entity";
export { FreezeTower } from "./entities/freeze.entity";
export { AntiAirTower } from "./entities/anti-air.entity";
export { TowerCharacter } from "./tower.abstract";

import { TowerCharacter } from "./tower.abstract";
import { CharactersLayer } from "@/Game/Character";
import { TowerTypes } from "@/common/enum/tower-types";
import { MachineGunTower } from "./entities/machine-gun.entity";
import { CannonTower } from "./entities/cannon.entity";
import { HeavyGunTower } from "./entities/heavy-gun.entity";
import { ElectricTower } from "./entities/electric.entity";
import { FreezeTower } from "./entities/freeze.entity";
import { AntiAirTower } from "./entities/anti-air.entity";

const TowerClassMap = {
  [TowerTypes.MACHINE_GUN]: MachineGunTower,
  [TowerTypes.MISSILE]: CannonTower,
  [TowerTypes.HEAVY_GUN]: HeavyGunTower,
  [TowerTypes.ELECTRIC]: ElectricTower,
  [TowerTypes.FREEZE]: FreezeTower,
  [TowerTypes.ANTI_AIR]: AntiAirTower,
} as const;

export function createTower(
  charactersLayer: CharactersLayer,
  type: TowerTypes
): TowerCharacter {
  return new TowerClassMap[type](charactersLayer);
}

import {
  getGoblinWalkForDirection,
  getGoblinDeathForDirection,
} from "@/Game/Character/Monster/animations/goblin";
import {
  getSlimeDeathForDirection,
  getSlimeWalkForDirection,
} from "@/Game/Character/Monster/animations/slime";
import {
  getWolfDeathForDirection,
  getWolfWalkForDirection,
} from "@/Game/Character/Monster/animations/wolf";
import {
  getBeeDeathForDirection,
  getBeeWalkForDirection,
} from "@/Game/Character/Monster/animations/bee";
import {
  getPlantDeathForDirection,
  getPlantWalkForDirection,
} from "@/Game/Character/Monster/animations/plant";
import {
  getOrcDeathForDirection,
  getOrcWalkForDirection,
} from "@/Game/Character/Monster/animations/orc";
import {
  getOrcLordDeathForDirection,
  getOrcLordWalkForDirection,
} from "@/Game/Character/Monster/animations/orcLord";
import {
  getSlimeBonedDeathForDirection,
  getSlimeBonedWalkForDirection,
} from "@/Game/Character/Monster/animations/slimeBoned";
import {
  getSlimeVulcanDeathForDirection,
  getSlimeVulcanWalkForDirection,
} from "@/Game/Character/Monster/animations/slimeVulcan";
import {
  getPlantZombieDeathForDirection,
  getPlantZombieWalkForDirection,
} from "@/Game/Character/Monster/animations/plantZombie";
import {
  getPlantFireDeathForDirection,
  getPlantFireWalkForDirection,
} from "@/Game/Character/Monster/animations/plantFire";

export const monsterWalkAnimations = {
  slime: getSlimeWalkForDirection,
  goblin: getGoblinWalkForDirection,
  wolf: getWolfWalkForDirection,
  bee: getBeeWalkForDirection,
  plant: getPlantWalkForDirection,
  orc: getOrcWalkForDirection,
  orcLord: getOrcLordWalkForDirection,
  slimeBoned: getSlimeBonedWalkForDirection,
  slimeVulcan: getSlimeVulcanWalkForDirection,
  plantZombie: getPlantZombieWalkForDirection,
  plantFire: getPlantFireWalkForDirection,
};

export const monsterDeathAnimations = {
  slime: getSlimeDeathForDirection,
  goblin: getGoblinDeathForDirection,
  wolf: getWolfDeathForDirection,
  bee: getBeeDeathForDirection,
  plant: getPlantDeathForDirection,
  orc: getOrcDeathForDirection,
  orcLord: getOrcLordDeathForDirection,
  slimeBoned: getSlimeBonedDeathForDirection,
  slimeVulcan: getSlimeVulcanDeathForDirection,
  plantZombie: getPlantZombieDeathForDirection,
  plantFire: getPlantFireDeathForDirection,
};

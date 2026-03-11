import { BIG, DEMONIC, HUGE, MEDIUM, SMALL } from "../constants/monsters.constants";

/** Optional armor tier for future use inside special (no damage effect in current phase). */
export type MonsterArmorTier = "none" | "low" | "high";

export interface MonsterConfig {
  wave_id: number;
  maxHealth: number;
  speed: number;
  gold: number;
  air?: boolean;
  spawnPerSide: number;
  spawnDuration: number;
  type: MonsterType;
  size: keyof typeof MonsterSize;
  special?: {
    stealth?: boolean;
    enrageOnLowHP?: boolean;
    healer?: boolean;
    noGoldReward?: boolean;
    armor?: MonsterArmorTier;
    resistToSlow?: boolean;
    resistToStun?: boolean;
    spawnsOnDeath?: MonsterConfig[];
    spawnsPerTime?: MonsterConfig[];
  };
}

export type MonsterType =
  | "slime"
  | "goblin"
  | "wolf"
  | "bee"
  | "plant"
  | "plantZombie"
  | "plantFire"
  | "orc"
  | "orcLord"
  | "slimeBoned"
  | "slimeVulcan";

export enum MonsterSize {
  small = SMALL,
  normal = MEDIUM,
  big = BIG,
  huge = HUGE,
  demonic = DEMONIC,
}

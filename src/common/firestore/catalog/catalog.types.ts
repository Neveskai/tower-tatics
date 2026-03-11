import type { SkillId } from "@/common/enum/skill-ids";
import { TowerTypes } from "@/common/enum/tower-types";

/** Special effects for tower (stun, slow, etc.) */
export interface TowerSpecial {
  stunDuration?: number;
  stunChance?: number;
  slowDuration?: number;
  slowFactor?: number;
}

/** Combat stats for a tower */
export interface TowerCombat {
  range: number;
  attackSpeed: number;
  attackDamage: number;
  AoE: number;
  attackAir: boolean;
  attackTerrain: boolean;
  special?: TowerSpecial;
}

/** Economy (cost, sell prices) - Firestore uses camelCase */
export interface TowerEconomy {
  cost: number;
  sellPrices?: Record<number, number>;
}

/** Single upgrade level */
export interface TowerUpgradeLevel {
  range?: number;
  attackSpeed?: number;
  attackDamage?: number;
  AoE?: number;
  cost: number;
  special?: TowerSpecial;
}

/** Assets for rendering */
export interface TowerAssets {
  bulletAsset: string;
  bulletSize: { width: number; height: number };
  bulletSpeed: number;
  iconKey?: string;
  spriteKey?: string;
}

/** Full tower config (game-ready, matches TowerConfigs shape) */
export interface TowerConfig {
  id: TowerTypes;
  bulletSpeed: number;
  bulletSize: { width: number; height: number };
  bulletAsset: string;
  range: number;
  attackSpeed: number;
  attackDamage: number;
  AoE: number;
  cost: number;
  attackAir: boolean;
  attackTerrain: boolean;
  special?: TowerSpecial;
  sell_prices: Record<number, number>;
  upgrades: Record<number, TowerUpgradeLevel>;
}

/** Firestore catalog_towers document (raw from DB) */
export interface FirestoreTowerCatalogDoc {
  id: string;
  order: number;
  i18nKeyName: string;
  i18nKeyDesc?: string;
  assets: {
    bulletAsset: string;
    bulletSize: { width: number; height: number };
    bulletSpeed: number;
    iconKey?: string;
    spriteKey?: string;
  };
  combat: TowerCombat;
  economy: TowerEconomy;
  upgrades: Record<number, TowerUpgradeLevel>;
  enabled: boolean;
}

/** Mission types */
export type MissionType =
  | "map-complete"
  | "kill-count"
  | "wave-count"
  | "tower-build"
  | "manual";

/** Mission target by type */
export type MissionTarget =
  | { mapId: number }
  | { count: number }
  | { towerId: TowerTypes; count: number }
  | Record<string, never>;

/** Mission rewards */
export interface MissionRewards {
  unlockTowers?: TowerTypes[];
  unlockSkills?: SkillId[];
}

/** Firestore catalog_missions document */
export interface FirestoreMissionCatalogDoc {
  id: string;
  titleKey?: string;
  title?: string;
  enabled: boolean;
  order: number;
  type: MissionType;
  target: MissionTarget;
  rewards: MissionRewards;
}

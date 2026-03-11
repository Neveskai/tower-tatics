import i18n from "../../../common/providers/i18n";
import { TowerTypes } from "@/common/enum/tower-types";
import type { TowerSpecial } from "@/common/firestore/catalog/catalog.types";

export const BASE_UPGRADE_DURATION = 3000;
export const MAX_TOWER_LEVEL = 6;
export const BASE_BULLET_MS = 200;

const SELL_TAX = 0.5;
export const MACHINE_GUN_COST = 5;
export const HEAVY_GUN_COST = MACHINE_GUN_COST * 3;
export const MISSILE_COST = MACHINE_GUN_COST * 4;
export const ELETRIC_COST = MACHINE_GUN_COST * 6;
export const ANTI_AIR_COST = MACHINE_GUN_COST * 10;
export const FREEZE_COST = MACHINE_GUN_COST * 10;

type BaseTowerConfig = {
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
  upgrades: Record<
    number,
    {
      range: number;
      attackSpeed: number;
      attackDamage: number;
      AoE: number;
      cost: number;
      special?: TowerSpecial;
    }
  >;
};

export const TowerConfigs: Record<TowerTypes, BaseTowerConfig> = {
  [TowerTypes.MACHINE_GUN]: {
    bulletSpeed: BASE_BULLET_MS,
    bulletSize: { width: 5, height: 20 },
    bulletAsset: "bullet-mg",
    range: 4,
    attackSpeed: 0.75,
    attackDamage: 20,
    AoE: 0,
    cost: MACHINE_GUN_COST,
    attackAir: true,
    attackTerrain: true,
    special: undefined,
    sell_prices: {
      1: Math.floor(MACHINE_GUN_COST * SELL_TAX),
      2: Math.floor(MACHINE_GUN_COST * 2 * SELL_TAX),
      3: Math.floor(MACHINE_GUN_COST * 5 * SELL_TAX),
      4: Math.floor(MACHINE_GUN_COST * 13 * SELL_TAX),
      5: Math.floor(MACHINE_GUN_COST * 25 * SELL_TAX),
      6: Math.floor(MACHINE_GUN_COST * 43 * SELL_TAX),
    },
    upgrades: {
      2: {
        range: 4,
        attackSpeed: 0.75,
        attackDamage: 40,
        AoE: 0,
        cost: MACHINE_GUN_COST,
      },
      3: {
        range: 4,
        attackSpeed: 0.75,
        attackDamage: 100,
        AoE: 0,
        cost: MACHINE_GUN_COST * 3,
      },
      4: {
        range: 4,
        attackSpeed: 0.75,
        attackDamage: 260,
        AoE: 0,
        cost: MACHINE_GUN_COST * 8,
      },
      5: {
        range: 4,
        attackSpeed: 0.75,
        attackDamage: 500,
        AoE: 0,
        cost: MACHINE_GUN_COST * 12,
      },
      6: {
        range: 8,
        attackSpeed: 0.6,
        attackDamage: 1000,
        AoE: 0,
        cost: MACHINE_GUN_COST * 18,
      },
    },
  },
  [TowerTypes.MISSILE]: {
    bulletSpeed: BASE_BULLET_MS,
    bulletSize: { width: 20, height: 20 },
    bulletAsset: "bullet-missile",
    range: 6,
    attackSpeed: 0.3,
    attackDamage: 40,
    AoE: 3,
    cost: MISSILE_COST,
    attackAir: false,
    attackTerrain: true,
    special: undefined,
    sell_prices: {
      1: Math.floor(MISSILE_COST * SELL_TAX),
      2: Math.floor(MISSILE_COST * 2 * SELL_TAX),
      3: Math.floor(MISSILE_COST * 5 * SELL_TAX),
      4: Math.floor(MISSILE_COST * 10 * SELL_TAX),
      5: Math.floor(MISSILE_COST * 22 * SELL_TAX),
      6: Math.floor(MISSILE_COST * 40 * SELL_TAX),
    },
    upgrades: {
      2: {
        range: 6,
        attackSpeed: 0.3,
        attackDamage: 80,
        AoE: 3,
        cost: MISSILE_COST,
      },
      3: {
        range: 6,
        attackSpeed: 0.3,
        attackDamage: 200,
        AoE: 3,
        cost: MISSILE_COST * 3,
      },
      4: {
        range: 6,
        attackSpeed: 0.35,
        attackDamage: 440,
        AoE: 3,
        cost: MISSILE_COST * 6,
      },
      5: {
        range: 6,
        attackSpeed: 0.35,
        attackDamage: 1000,
        AoE: 3,
        cost: MISSILE_COST * 12,
      },
      6: {
        range: 7,
        attackSpeed: 0.4,
        attackDamage: 1720,
        AoE: 3,
        cost: MISSILE_COST * 18,
      },
    },
  },
  [TowerTypes.HEAVY_GUN]: {
    bulletSpeed: BASE_BULLET_MS * 4,
    bulletSize: { width: 10, height: 16 },
    bulletAsset: "bullet-mg",
    range: 5,
    attackSpeed: 5,
    attackDamage: 10,
    AoE: 0,
    cost: HEAVY_GUN_COST,
    attackAir: true,
    attackTerrain: true,
    special: undefined,
    sell_prices: {
      1: Math.floor(HEAVY_GUN_COST * SELL_TAX),
      2: Math.floor(HEAVY_GUN_COST * 2 * SELL_TAX),
      3: Math.floor(HEAVY_GUN_COST * 5 * SELL_TAX),
      4: Math.floor(HEAVY_GUN_COST * 13 * SELL_TAX),
      5: Math.floor(HEAVY_GUN_COST * 29 * SELL_TAX),
      6: Math.floor(HEAVY_GUN_COST * 51 * SELL_TAX),
    },
    upgrades: {
      2: {
        range: 5,
        attackSpeed: 5,
        attackDamage: 20,
        AoE: 0,
        cost: HEAVY_GUN_COST,
      },
      3: {
        range: 5,
        attackSpeed: 5,
        attackDamage: 50,
        AoE: 0,
        cost: HEAVY_GUN_COST * 3,
      },
      4: {
        range: 5,
        attackSpeed: 5,
        attackDamage: 130,
        AoE: 0,
        cost: HEAVY_GUN_COST * 8,
      },
      5: {
        range: 5,
        attackSpeed: 5.5,
        attackDamage: 340,
        AoE: 0,
        cost: HEAVY_GUN_COST * 16,
      },
      6: {
        range: 6,
        attackSpeed: 5.5,
        attackDamage: 720,
        AoE: 0,
        cost: HEAVY_GUN_COST * 24,
      },
    },
  },
  [TowerTypes.ELECTRIC]: {
    bulletSpeed: BASE_BULLET_MS,
    bulletSize: { width: 1, height: 1 },
    bulletAsset: "bullet-mg",
    AoE: 2.5,
    range: 2.5,
    attackSpeed: 0.5,
    attackDamage: 40,
    cost: ELETRIC_COST,
    attackAir: false,
    attackTerrain: true,
    special: {
      stunDuration: 0.65,
      stunChance: 0.1,
    },
    sell_prices: {
      1: Math.floor(ELETRIC_COST * SELL_TAX),
      2: Math.floor(ELETRIC_COST * 2 * SELL_TAX),
      3: Math.floor(ELETRIC_COST * 5 * SELL_TAX),
      4: Math.floor(ELETRIC_COST * 10 * SELL_TAX),
      5: Math.floor(ELETRIC_COST * 17 * SELL_TAX),
      6: Math.floor(ELETRIC_COST * 26 * SELL_TAX),
    },
    upgrades: {
      2: {
        AoE: 2.5,
        range: 2.5,
        attackSpeed: 0.5,
        attackDamage: 80,
        special: {
          stunDuration: 0.65,
          stunChance: 0.12,
        },
        cost: ELETRIC_COST,
      },
      3: {
        AoE: 2.5,
        range: 2.5,
        attackSpeed: 0.5,
        attackDamage: 200,
        special: {
          stunDuration: 0.65,
          stunChance: 0.14,
        },
        cost: ELETRIC_COST * 3,
      },
      4: {
        AoE: 2.5,
        range: 2.5,
        attackSpeed: 0.5,
        attackDamage: 400,
        special: {
          stunDuration: 0.65,
          stunChance: 0.16,
        },
        cost: ELETRIC_COST * 5,
      },
      5: {
        AoE: 2.5,
        range: 2.5,
        attackSpeed: 0.5,
        attackDamage: 680,
        special: {
          stunDuration: 0.7,
          stunChance: 0.18,
        },
        cost: ELETRIC_COST * 7,
      },
      6: {
        AoE: 2.5,
        range: 2.5,
        attackSpeed: 0.5,
        attackDamage: 1080,
        special: {
          stunDuration: 0.75,
          stunChance: 0.2,
        },
        cost: ELETRIC_COST * 10,
      },
    },
  },
  [TowerTypes.FREEZE]: {
    bulletSpeed: BASE_BULLET_MS,
    bulletSize: { width: 15, height: 20 },
    bulletAsset: "bullet-mg",
    range: 4,
    attackSpeed: 2,
    attackDamage: 5,
    AoE: 0,
    cost: FREEZE_COST,
    attackAir: true,
    attackTerrain: true,
    special: {
      slowDuration: 3.5,
      slowFactor: 0.75,
    },
    sell_prices: {
      1: Math.floor(FREEZE_COST * SELL_TAX),
      2: Math.floor(FREEZE_COST * 1.5 * SELL_TAX),
      3: Math.floor(FREEZE_COST * 2 * SELL_TAX),
      4: Math.floor(FREEZE_COST * 2.5 * SELL_TAX),
      5: Math.floor(FREEZE_COST * 3 * SELL_TAX),
      6: Math.floor(FREEZE_COST * 4 * SELL_TAX),
    },
    upgrades: {
      2: {
        range: 4,
        attackSpeed: 2,
        attackDamage: 10,
        AoE: 0,
        special: {
          slowDuration: 3.5,
          slowFactor: 0.8,
        },
        cost: FREEZE_COST * 0.5,
      },
      3: {
        range: 4,
        attackSpeed: 2,
        attackDamage: 15,
        AoE: 0,
        special: {
          slowDuration: 3.5,
          slowFactor: 0.75,
        },
        cost: FREEZE_COST * 0.5,
      },
      4: {
        range: 4,
        attackSpeed: 2,
        attackDamage: 20,
        AoE: 0,
        special: {
          slowDuration: 3.5,
          slowFactor: 0.7,
        },
        cost: FREEZE_COST * 0.5,
      },
      5: {
        range: 4,
        attackSpeed: 2,
        attackDamage: 25,
        AoE: 0,
        special: {
          slowDuration: 4,
          slowFactor: 0.65,
        },
        cost: FREEZE_COST * 0.5,
      },
      6: {
        range: 5,
        attackSpeed: 2,
        attackDamage: 50,
        AoE: 0,
        special: {
          slowDuration: 4,
          slowFactor: 0.65,
        },
        cost: FREEZE_COST,
      },
    },
  },
  [TowerTypes.ANTI_AIR]: {
    bulletSpeed: BASE_BULLET_MS * 0.75,
    bulletSize: { width: 7, height: 15 },
    bulletAsset: "bullet-anti-air",
    range: 4,
    attackSpeed: 1.25,
    attackDamage: 80,
    AoE: 2,
    cost: ANTI_AIR_COST,
    attackAir: true,
    attackTerrain: false,
    special: undefined,
    sell_prices: {
      1: Math.floor(ANTI_AIR_COST * SELL_TAX),
      2: Math.floor(ANTI_AIR_COST * 2 * SELL_TAX),
      3: Math.floor(ANTI_AIR_COST * 4 * SELL_TAX),
      4: Math.floor(ANTI_AIR_COST * 7 * SELL_TAX),
      5: Math.floor(ANTI_AIR_COST * 12 * SELL_TAX),
      6: Math.floor(ANTI_AIR_COST * 19 * SELL_TAX),
    },
    upgrades: {
      2: {
        range: 4,
        attackSpeed: 1.25,
        attackDamage: 160,
        AoE: 2,
        cost: ANTI_AIR_COST,
      },
      3: {
        range: 4,
        attackSpeed: 1.25,
        attackDamage: 340,
        AoE: 2,
        cost: ANTI_AIR_COST * 2,
      },
      4: {
        range: 4,
        attackSpeed: 1.25,
        attackDamage: 620,
        AoE: 2,
        cost: ANTI_AIR_COST * 3,
      },
      5: {
        range: 4,
        attackSpeed: 1.5,
        attackDamage: 1080,
        AoE: 2,
        cost: ANTI_AIR_COST * 5,
      },
      6: {
        range: 5,
        attackSpeed: 1.75,
        attackDamage: 1720,
        AoE: 2,
        cost: ANTI_AIR_COST * 7,
      },
    },
  },
};

const TowerShopOptions: {
  id: TowerTypes;
  label: string;
  cost: number;
}[] = [
  {
    id: TowerTypes.MACHINE_GUN,
    label: `${i18n.t("turretMachineGun")}`,
    cost: TowerConfigs[TowerTypes.MACHINE_GUN].cost,
  },
  {
    id: TowerTypes.MISSILE,
    label: `${i18n.t("turretCannon")}`,
    cost: TowerConfigs[TowerTypes.MISSILE].cost,
  },
  {
    id: TowerTypes.HEAVY_GUN,
    label: `${i18n.t("turretHeavyGun")}`,
    cost: TowerConfigs[TowerTypes.HEAVY_GUN].cost,
  },
  {
    id: TowerTypes.ELECTRIC,
    label: `${i18n.t("turretElectric")}`,
    cost: TowerConfigs[TowerTypes.ELECTRIC].cost,
  },
  {
    id: TowerTypes.FREEZE,
    label: `${i18n.t("turretFreeze")}`,
    cost: TowerConfigs[TowerTypes.FREEZE].cost,
  },
  {
    id: TowerTypes.ANTI_AIR,
    label: `${i18n.t("turretAntiAir")}`,
    cost: TowerConfigs[TowerTypes.ANTI_AIR].cost,
  },
].reverse();

export const towerShopEnum: Record<string, TowerTypes> = {
  "1": TowerTypes.MACHINE_GUN,
  "2": TowerTypes.MISSILE,
  "3": TowerTypes.HEAVY_GUN,
  "4": TowerTypes.ELECTRIC,
  "5": TowerTypes.FREEZE,
  "6": TowerTypes.ANTI_AIR,
};

export { TowerShopOptions };

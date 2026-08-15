/**
 * Payload JSON do catálogo Godot (WSN-55).
 * Combate/economia alinhados a scripts/seed-catalog-towers.ts (espelho de TowerConfigs).
 * Heat só existe nas entities 2D — copiado de combat.md / machine-gun + heavy-gun.
 * Não importar towers.constants.ts daqui (puxa i18n → Capacitor Storage).
 */

const SELL_TAX = 0.5;
const MACHINE_GUN_COST = 5;
const HEAVY_GUN_COST = 15;
const MISSILE_COST = 20;
const ELETRIC_COST = 30;
const ANTI_AIR_COST = 50;
const FREEZE_COST = 50;

const HEAT: Record<string, { max: number; per_shot: number; cool_rate: number }> = {
  "machine-gun": { max: 100, per_shot: 10, cool_rate: 0.08 },
  "heavy-gun": { max: 120, per_shot: 15, cool_rate: 0.06 },
};

type Combat = {
  range: number;
  attackSpeed: number;
  attackDamage: number;
  AoE: number;
  attackAir: boolean;
  attackTerrain: boolean;
  special?: Record<string, number>;
};

type Upgrade = Combat & { cost: number; special?: Record<string, number> };

type TowerSrc = {
  id: string;
  combat: Combat;
  cost: number;
  sellPrices: Record<number, number>;
  upgrades: Record<number, Upgrade>;
};

function snakeSpecial(special?: Record<string, number>): Record<string, number> | undefined {
  if (!special) return undefined;
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(special)) {
    out[key.replace(/[A-Z]/g, (ch) => `_${ch.toLowerCase()}`)] = value;
  }
  return out;
}

function toGodotTower(src: TowerSrc): Record<string, unknown> {
  const sell_prices: Record<string, number> = {};
  for (const [lvl, price] of Object.entries(src.sellPrices)) {
    sell_prices[lvl] = price;
  }
  const upgrades: Record<string, unknown> = {};
  for (const [lvl, u] of Object.entries(src.upgrades)) {
    const special = snakeSpecial(u.special);
    upgrades[lvl] = {
      range: u.range,
      attack_speed: u.attackSpeed,
      attack_damage: u.attackDamage,
      aoe: u.AoE,
      cost: u.cost,
      ...(special ? { special } : {}),
    };
  }
  const heat = HEAT[src.id];
  const special = snakeSpecial(src.combat.special);
  return {
    cost: src.cost,
    range: src.combat.range,
    attack_speed: src.combat.attackSpeed,
    attack_damage: src.combat.attackDamage,
    aoe: src.combat.AoE,
    attack_air: src.combat.attackAir,
    attack_terrain: src.combat.attackTerrain,
    ...(special ? { special } : {}),
    sell_prices,
    upgrades,
    ...(heat ? { heat } : {}),
  };
}

function towersSrc(): TowerSrc[] {
  return [
    {
      id: "machine-gun",
      combat: { range: 4, attackSpeed: 0.75, attackDamage: 20, AoE: 0, attackAir: true, attackTerrain: true },
      cost: MACHINE_GUN_COST,
      sellPrices: {
        1: Math.floor(MACHINE_GUN_COST * SELL_TAX),
        2: Math.floor(MACHINE_GUN_COST * 2 * SELL_TAX),
        3: Math.floor(MACHINE_GUN_COST * 5 * SELL_TAX),
        4: Math.floor(MACHINE_GUN_COST * 13 * SELL_TAX),
        5: Math.floor(MACHINE_GUN_COST * 25 * SELL_TAX),
        6: Math.floor(MACHINE_GUN_COST * 43 * SELL_TAX),
      },
      upgrades: {
        2: { range: 4, attackSpeed: 0.75, attackDamage: 40, AoE: 0, attackAir: true, attackTerrain: true, cost: MACHINE_GUN_COST },
        3: { range: 4, attackSpeed: 0.75, attackDamage: 100, AoE: 0, attackAir: true, attackTerrain: true, cost: MACHINE_GUN_COST * 3 },
        4: { range: 4, attackSpeed: 0.75, attackDamage: 260, AoE: 0, attackAir: true, attackTerrain: true, cost: MACHINE_GUN_COST * 8 },
        5: { range: 4, attackSpeed: 0.75, attackDamage: 500, AoE: 0, attackAir: true, attackTerrain: true, cost: MACHINE_GUN_COST * 12 },
        6: { range: 8, attackSpeed: 0.6, attackDamage: 1000, AoE: 0, attackAir: true, attackTerrain: true, cost: MACHINE_GUN_COST * 18 },
      },
    },
    {
      id: "missile",
      combat: { range: 6, attackSpeed: 0.3, attackDamage: 40, AoE: 3, attackAir: false, attackTerrain: true },
      cost: MISSILE_COST,
      sellPrices: {
        1: Math.floor(MISSILE_COST * SELL_TAX),
        2: Math.floor(MISSILE_COST * 2 * SELL_TAX),
        3: Math.floor(MISSILE_COST * 5 * SELL_TAX),
        4: Math.floor(MISSILE_COST * 10 * SELL_TAX),
        5: Math.floor(MISSILE_COST * 22 * SELL_TAX),
        6: Math.floor(MISSILE_COST * 40 * SELL_TAX),
      },
      upgrades: {
        2: { range: 6, attackSpeed: 0.3, attackDamage: 80, AoE: 3, attackAir: false, attackTerrain: true, cost: MISSILE_COST },
        3: { range: 6, attackSpeed: 0.3, attackDamage: 200, AoE: 3, attackAir: false, attackTerrain: true, cost: MISSILE_COST * 3 },
        4: { range: 6, attackSpeed: 0.35, attackDamage: 440, AoE: 3, attackAir: false, attackTerrain: true, cost: MISSILE_COST * 6 },
        5: { range: 6, attackSpeed: 0.35, attackDamage: 1000, AoE: 3, attackAir: false, attackTerrain: true, cost: MISSILE_COST * 12 },
        6: { range: 7, attackSpeed: 0.4, attackDamage: 1720, AoE: 3, attackAir: false, attackTerrain: true, cost: MISSILE_COST * 18 },
      },
    },
    {
      id: "heavy-gun",
      combat: { range: 5, attackSpeed: 5, attackDamage: 10, AoE: 0, attackAir: true, attackTerrain: true },
      cost: HEAVY_GUN_COST,
      sellPrices: {
        1: Math.floor(HEAVY_GUN_COST * SELL_TAX),
        2: Math.floor(HEAVY_GUN_COST * 2 * SELL_TAX),
        3: Math.floor(HEAVY_GUN_COST * 5 * SELL_TAX),
        4: Math.floor(HEAVY_GUN_COST * 13 * SELL_TAX),
        5: Math.floor(HEAVY_GUN_COST * 29 * SELL_TAX),
        6: Math.floor(HEAVY_GUN_COST * 51 * SELL_TAX),
      },
      upgrades: {
        2: { range: 5, attackSpeed: 5, attackDamage: 20, AoE: 0, attackAir: true, attackTerrain: true, cost: HEAVY_GUN_COST },
        3: { range: 5, attackSpeed: 5, attackDamage: 50, AoE: 0, attackAir: true, attackTerrain: true, cost: HEAVY_GUN_COST * 3 },
        4: { range: 5, attackSpeed: 5, attackDamage: 130, AoE: 0, attackAir: true, attackTerrain: true, cost: HEAVY_GUN_COST * 8 },
        5: { range: 5, attackSpeed: 5.5, attackDamage: 340, AoE: 0, attackAir: true, attackTerrain: true, cost: HEAVY_GUN_COST * 16 },
        6: { range: 6, attackSpeed: 5.5, attackDamage: 720, AoE: 0, attackAir: true, attackTerrain: true, cost: HEAVY_GUN_COST * 24 },
      },
    },
    {
      id: "electric",
      combat: {
        range: 2.5,
        attackSpeed: 0.5,
        attackDamage: 40,
        AoE: 2.5,
        attackAir: false,
        attackTerrain: true,
        special: { stunDuration: 0.65, stunChance: 0.1 },
      },
      cost: ELETRIC_COST,
      sellPrices: {
        1: Math.floor(ELETRIC_COST * SELL_TAX),
        2: Math.floor(ELETRIC_COST * 2 * SELL_TAX),
        3: Math.floor(ELETRIC_COST * 5 * SELL_TAX),
        4: Math.floor(ELETRIC_COST * 10 * SELL_TAX),
        5: Math.floor(ELETRIC_COST * 17 * SELL_TAX),
        6: Math.floor(ELETRIC_COST * 26 * SELL_TAX),
      },
      upgrades: {
        2: {
          range: 2.5, attackSpeed: 0.5, attackDamage: 80, AoE: 2.5, attackAir: false, attackTerrain: true,
          cost: ELETRIC_COST, special: { stunDuration: 0.65, stunChance: 0.12 },
        },
        3: {
          range: 2.5, attackSpeed: 0.5, attackDamage: 200, AoE: 2.5, attackAir: false, attackTerrain: true,
          cost: ELETRIC_COST * 3, special: { stunDuration: 0.65, stunChance: 0.14 },
        },
        4: {
          range: 2.5, attackSpeed: 0.5, attackDamage: 400, AoE: 2.5, attackAir: false, attackTerrain: true,
          cost: ELETRIC_COST * 5, special: { stunDuration: 0.65, stunChance: 0.16 },
        },
        5: {
          range: 2.5, attackSpeed: 0.5, attackDamage: 680, AoE: 2.5, attackAir: false, attackTerrain: true,
          cost: ELETRIC_COST * 7, special: { stunDuration: 0.7, stunChance: 0.18 },
        },
        6: {
          range: 2.5, attackSpeed: 0.5, attackDamage: 1080, AoE: 2.5, attackAir: false, attackTerrain: true,
          cost: ELETRIC_COST * 10, special: { stunDuration: 0.75, stunChance: 0.2 },
        },
      },
    },
    {
      id: "freeze",
      combat: {
        range: 4, attackSpeed: 2, attackDamage: 5, AoE: 0, attackAir: true, attackTerrain: true,
        special: { slowDuration: 3.5, slowFactor: 0.75 },
      },
      cost: FREEZE_COST,
      sellPrices: {
        1: Math.floor(FREEZE_COST * SELL_TAX),
        2: Math.floor(FREEZE_COST * 1.5 * SELL_TAX),
        3: Math.floor(FREEZE_COST * 2 * SELL_TAX),
        4: Math.floor(FREEZE_COST * 2.5 * SELL_TAX),
        5: Math.floor(FREEZE_COST * 3 * SELL_TAX),
        6: Math.floor(FREEZE_COST * 4 * SELL_TAX),
      },
      upgrades: {
        2: {
          range: 4, attackSpeed: 2, attackDamage: 10, AoE: 0, attackAir: true, attackTerrain: true,
          cost: FREEZE_COST * 0.5, special: { slowDuration: 3.5, slowFactor: 0.8 },
        },
        3: {
          range: 4, attackSpeed: 2, attackDamage: 15, AoE: 0, attackAir: true, attackTerrain: true,
          cost: FREEZE_COST * 0.5, special: { slowDuration: 3.5, slowFactor: 0.75 },
        },
        4: {
          range: 4, attackSpeed: 2, attackDamage: 20, AoE: 0, attackAir: true, attackTerrain: true,
          cost: FREEZE_COST * 0.5, special: { slowDuration: 3.5, slowFactor: 0.7 },
        },
        5: {
          range: 4, attackSpeed: 2, attackDamage: 25, AoE: 0, attackAir: true, attackTerrain: true,
          cost: FREEZE_COST * 0.5, special: { slowDuration: 4, slowFactor: 0.65 },
        },
        6: {
          range: 5, attackSpeed: 2, attackDamage: 50, AoE: 0, attackAir: true, attackTerrain: true,
          cost: FREEZE_COST, special: { slowDuration: 4, slowFactor: 0.65 },
        },
      },
    },
    {
      id: "anti-air",
      combat: { range: 4, attackSpeed: 1.25, attackDamage: 80, AoE: 2, attackAir: true, attackTerrain: false },
      cost: ANTI_AIR_COST,
      sellPrices: {
        1: Math.floor(ANTI_AIR_COST * SELL_TAX),
        2: Math.floor(ANTI_AIR_COST * 2 * SELL_TAX),
        3: Math.floor(ANTI_AIR_COST * 4 * SELL_TAX),
        4: Math.floor(ANTI_AIR_COST * 7 * SELL_TAX),
        5: Math.floor(ANTI_AIR_COST * 12 * SELL_TAX),
        6: Math.floor(ANTI_AIR_COST * 19 * SELL_TAX),
      },
      upgrades: {
        2: { range: 4, attackSpeed: 1.25, attackDamage: 160, AoE: 2, attackAir: true, attackTerrain: false, cost: ANTI_AIR_COST },
        3: { range: 4, attackSpeed: 1.25, attackDamage: 340, AoE: 2, attackAir: true, attackTerrain: false, cost: ANTI_AIR_COST * 2 },
        4: { range: 4, attackSpeed: 1.25, attackDamage: 620, AoE: 2, attackAir: true, attackTerrain: false, cost: ANTI_AIR_COST * 3 },
        5: { range: 4, attackSpeed: 1.5, attackDamage: 1080, AoE: 2, attackAir: true, attackTerrain: false, cost: ANTI_AIR_COST * 5 },
        6: { range: 5, attackSpeed: 1.75, attackDamage: 1720, AoE: 2, attackAir: true, attackTerrain: false, cost: ANTI_AIR_COST * 7 },
      },
    },
  ];
}

export function buildTowersJson(): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const src of towersSrc()) {
    out[src.id] = toGodotTower(src);
  }
  return out;
}

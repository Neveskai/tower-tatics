import { TowerCharacter } from "@/Game/Character/Tower";

export const EMPTY_TOWER = {
  sell: () => false,
  upgrade: () => false,
  onStatisticsChange: () => () => false,
  onUpgradeChange: () => () => false,
  getName: () => "-",
  getNextLevelStats: () => ({
    cost: 0,
    attackSpeed: 0,
    attackDamage: 0,
  }),
  statsTracker: {
    totalDamage: 0,
    hordeDamage: 0,
  },
  upgrader: {
    isUpgrading: false,
    upgradeTimer: 0,
    progress: 0,
  },
  sell_price: 0,
  type: "-",
  level: 0,
  attackSpeed: 0,
  attackDamage: 0,
  isUpgrading: false,
} as unknown as TowerCharacter;

export const EMPTY_PROGRESS = {
  progress: 0,
  level: 0,
  isUpgrading: false,
};

export type UpgradeState = {
  progress: number;
  isUpgrading: boolean;
  level: number;
  upgradeTimer?: number;
  maintenanceDuration?: number;
};

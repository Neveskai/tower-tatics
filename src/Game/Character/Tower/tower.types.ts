import { ElectricAimShoot } from "./strategy/aim-shoot/electric";
import {
  AntiAirAimShoot,
  DefaultAimShoot,
  FreezeAimShoot,
  HeavyGunAimShoot,
} from "./strategy/aim-shoot";

export type DamageStatisticsObserver = (stats: {
  totalDamage: number;
  hordeDamage: number;
}) => void;

export type UpgradeProgressObserver = (stats: {
  progress: number;
  isUpgrading: boolean;
  level: number;
}) => void;

export type AimShootStrategy =
  | DefaultAimShoot
  | AntiAirAimShoot
  | HeavyGunAimShoot
  | ElectricAimShoot
  | FreezeAimShoot;

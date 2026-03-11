import { TowerTypes } from "@/common/enum/tower-types";
import i18n from "@/common/providers/i18n";

export const Names = {
  [TowerTypes.MACHINE_GUN]: i18n.t("turretMachineGun"),
  [TowerTypes.HEAVY_GUN]: i18n.t("turretHeavyGun"),
  [TowerTypes.MISSILE]: i18n.t("turretCannon"),
  [TowerTypes.ANTI_AIR]: i18n.t("turretAntiAir"),
  [TowerTypes.ELECTRIC]: i18n.t("turretElectric"),
  [TowerTypes.FREEZE]: i18n.t("turretFreeze"),
};

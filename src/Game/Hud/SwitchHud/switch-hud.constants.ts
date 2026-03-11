import { HudModes } from "@/common/enum/hud-modes";

export type SwitchHudModeClassKey = "modeBattle" | "modeTower" | "modeShop";

export interface SwitchHudButtonConfig {
  mode: HudModes;
  icon: "shop" | "monster" | "tower";
  titleKey: string;
  modeClassKey: SwitchHudModeClassKey;
}

export const SWITCH_HUD_BUTTONS: SwitchHudButtonConfig[] = [
  { mode: HudModes.MONSTER, icon: "monster", titleKey: "battleMode", modeClassKey: "modeBattle" },
  { mode: HudModes.TOWER, icon: "tower", titleKey: "towerMode", modeClassKey: "modeTower" },
  { mode: HudModes.SHOP, icon: "shop", titleKey: "shopMode", modeClassKey: "modeShop" },
];

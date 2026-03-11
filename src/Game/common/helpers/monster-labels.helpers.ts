import { FAST, NORMAL, SLOW, VERY_FAST, VERY_SLOW } from "../constants/monsters.constants";
import i18n from "../../../common/providers/i18n";
import { MonsterType } from "../types/monsters.types";

const capitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1);

export const getMonsterDisplayName = (type: MonsterType): string => {
  return type ? capitalize(type) : "-";
};

const speedLabel: { [key: number]: string } = {
  [VERY_SLOW]: i18n.t("verySlow"),
  [SLOW]: i18n.t("slow"),
  [NORMAL]: i18n.t("normal"),
  [FAST]: i18n.t("fast"),
  [VERY_FAST]: i18n.t("veryFast"),
};

/** Speed tier for icon selection (verySlow | slow | normal | fast | veryFast). */
export type SpeedTier = "verySlow" | "slow" | "normal" | "fast" | "veryFast";

const SPEED_TIERS: { value: number; tier: SpeedTier }[] = [
  { value: VERY_FAST, tier: "veryFast" },
  { value: FAST, tier: "fast" },
  { value: NORMAL, tier: "normal" },
  { value: SLOW, tier: "slow" },
  { value: VERY_SLOW, tier: "verySlow" },
];

export const getSpeedTier = (speed: number): SpeedTier => {
  let best: SpeedTier = "normal";
  let bestDiff = Infinity;
  for (const { value, tier } of SPEED_TIERS) {
    const diff = Math.abs(speed - value);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = tier;
    }
  }
  return best;
};

export const getSpeedLabel = (speed: number): string => {
  return speedLabel[speed] || "-";
};

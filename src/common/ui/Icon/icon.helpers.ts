import type { Icons } from "./icon.types";

/** Icon name for monster speed tier (use with getSpeedTier from monster-labels). 1 arrow = slow, 2 = medium, 3 = fast, 4 = ultra fast. */
export function getSpeedIconName(
  tier: "verySlow" | "slow" | "normal" | "fast" | "veryFast"
): Icons {
  const map: Record<string, Icons> = {
    verySlow: "speed-1",
    slow: "speed-1",
    normal: "speed-2",
    fast: "speed-3",
    veryFast: "speed-4",
  };
  return map[tier] ?? "speed-2";
}

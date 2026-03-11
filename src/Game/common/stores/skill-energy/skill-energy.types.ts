export interface SkillEnergyState {
  segments: number;
  maxSegments: number;
  regenIntervalMs: number;
  tickMs: number;
  progressMs: number;
  /** Dev only: when true, canSpend always returns true and spend does not deduct. */
  infiniteMana: boolean;
  setInfiniteMana: (value: boolean) => void;
  startRegen: () => void;
  stopRegen: () => void;
  canSpend: (amount: number) => boolean;
  spend: (amount: number) => void;
  reset: () => void;
}

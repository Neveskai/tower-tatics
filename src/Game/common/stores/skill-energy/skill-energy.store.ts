import { create } from "zustand";
import { SKILL_MAX_SEGMENTS, SKILL_SEGMENT_REGEN_MS } from "../../constants/skills.constants";
import type { SkillEnergyState } from "./skill-energy.types";

const DEFAULT_TICK_MS = 200;

let regenTimer: ReturnType<typeof setInterval> | null = null;

export const useSkillEnergyStore = create<SkillEnergyState>((set, get) => ({
  segments: 0,
  maxSegments: SKILL_MAX_SEGMENTS,
  regenIntervalMs: SKILL_SEGMENT_REGEN_MS,
  tickMs: DEFAULT_TICK_MS,
  progressMs: 0,
  infiniteMana: false,
  setInfiniteMana: (value: boolean) => set({ infiniteMana: value }),

  startRegen: () => {
    if (regenTimer) return;

    regenTimer = setInterval(() => {
      const { regenIntervalMs, maxSegments } = get();
      set((state) => {
        if (state.segments >= maxSegments) {
          return { ...state, progressMs: 0 };
        }

        const nextProgress = state.progressMs + state.tickMs;

        if (nextProgress >= regenIntervalMs) {
          const extra = nextProgress - regenIntervalMs;
          const nextSegments = Math.min(maxSegments, state.segments + 1);
          return {
            ...state,
            segments: nextSegments,
            progressMs: extra,
          };
        }

        return { ...state, progressMs: nextProgress };
      });
    }, get().tickMs);
  },

  stopRegen: () => {
    if (regenTimer) {
      clearInterval(regenTimer);
      regenTimer = null;
    }
  },

  canSpend: (amount: number) => {
    if (get().infiniteMana) return true;
    return get().segments >= amount;
  },

  spend: (amount: number) => {
    if (get().infiniteMana) return;
    set((state) => {
      const next = Math.max(0, state.segments - amount);
      return { ...state, segments: next };
    });
  },

  reset: () => {
    set({ segments: 0, progressMs: 0 });
  },
}));


import { create } from "zustand";
import type { SkillId } from "@/common/enum/skill-ids";
import { DEFAULT_SKILL } from "@/common/enum/skill-ids";
import type { SkillProgress } from "@/common/stores/skill-progress/skill-progress.storage";
import {
  loadSkillProgress,
  saveSkillProgress,
  clampEnabled,
} from "@/common/stores/skill-progress/skill-progress.storage";
import { usePlayerStore } from "@/common/stores/player/player.store";
import { syncFromLocal } from "@/common/functions/firebase-sync";

const MAX_ENABLED = 3;

async function syncProgressIfLoggedIn(): Promise<void> {
  const user = usePlayerStore.getState().user;
  if (user) {
    await syncFromLocal(user.uid, true);
  }
}

export interface SkillProgressState {
  skillProgress: SkillProgress | null;
  loaded: boolean;
  loadSkillProgress: () => Promise<void>;
  enableSkill: (skillId: SkillId) => Promise<void>;
  disableSkill: (skillId: SkillId) => Promise<void>;
  unlockSkill: (skillId: SkillId) => Promise<void>;
  getUnlockedSkills: () => SkillId[];
  getEnabledSkills: () => SkillId[];
}

export const useSkillProgressStore = create<SkillProgressState>((set, get) => ({
  skillProgress: null,
  loaded: false,

  loadSkillProgress: async () => {
    let progress = await loadSkillProgress();

    if (!progress) {
      progress = {
        unlocked: [DEFAULT_SKILL],
        enabled: [DEFAULT_SKILL],
      };
      await saveSkillProgress(progress);
      await syncProgressIfLoggedIn();
    }

    set({ skillProgress: progress, loaded: true });
  },

  enableSkill: async (skillId: SkillId) => {
    const { skillProgress } = get();
    if (!skillProgress) return;
    if (!skillProgress.unlocked.includes(skillId)) return;
    if (skillProgress.enabled.includes(skillId)) return;
    if (skillProgress.enabled.length >= MAX_ENABLED) return;

    const enabled = clampEnabled(
      [...skillProgress.enabled, skillId],
      skillProgress.unlocked
    );
    const updated = { ...skillProgress, enabled };
    await saveSkillProgress(updated);
    set({ skillProgress: updated });
    await syncProgressIfLoggedIn();
  },

  disableSkill: async (skillId: SkillId) => {
    const { skillProgress } = get();
    if (!skillProgress) return;

    const enabled = skillProgress.enabled.filter((id) => id !== skillId);
    const clamped = clampEnabled(enabled, skillProgress.unlocked);
    const updated = { ...skillProgress, enabled: clamped };
    await saveSkillProgress(updated);
    set({ skillProgress: updated });
    await syncProgressIfLoggedIn();
  },

  unlockSkill: async (skillId: SkillId) => {
    const { skillProgress } = get();
    if (!skillProgress) return;
    if (skillProgress.unlocked.includes(skillId)) return;

    const unlocked = [...skillProgress.unlocked, skillId];
    const updated = { ...skillProgress, unlocked };
    await saveSkillProgress(updated);
    set({ skillProgress: updated });
    await syncProgressIfLoggedIn();
  },

  getUnlockedSkills: (): SkillId[] => {
    return get().skillProgress?.unlocked ?? [DEFAULT_SKILL];
  },

  getEnabledSkills: (): SkillId[] => {
    const progress = get().skillProgress;
    if (!progress) return [DEFAULT_SKILL];
    return progress.enabled.length > 0
      ? clampEnabled(progress.enabled, progress.unlocked)
      : [DEFAULT_SKILL];
  },
}));

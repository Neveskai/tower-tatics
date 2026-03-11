import { Storage } from "@capacitor/storage";
import type { SkillId } from "@/common/enum/skill-ids";

const SKILL_PROGRESS_KEY = "skill_progress";

export interface SkillProgress {
  unlocked: SkillId[];
  enabled: SkillId[];
}

const MAX_ENABLED = 3;
const MIN_ENABLED = 1;

export function clampEnabled(
  enabled: SkillId[],
  unlocked: SkillId[]
): SkillId[] {
  const valid = enabled.filter((id) => unlocked.includes(id));
  const clamped = valid.slice(0, MAX_ENABLED);
  if (clamped.length < MIN_ENABLED && unlocked.length > 0) {
    const firstUnlocked = unlocked[0];
    if (!clamped.includes(firstUnlocked)) {
      return [firstUnlocked, ...clamped].slice(0, MAX_ENABLED);
    }
  }
  return clamped;
}

export async function saveSkillProgress(progress: SkillProgress): Promise<void> {
  const clamped = {
    ...progress,
    enabled: clampEnabled(progress.enabled, progress.unlocked),
  };
  await Storage.set({
    key: SKILL_PROGRESS_KEY,
    value: JSON.stringify(clamped),
  });
}

export async function loadSkillProgress(): Promise<SkillProgress | null> {
  const { value } = await Storage.get({ key: SKILL_PROGRESS_KEY });
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as SkillProgress;
    return {
      ...parsed,
      enabled: clampEnabled(parsed.enabled ?? [], parsed.unlocked ?? []),
    };
  } catch {
    return null;
  }
}

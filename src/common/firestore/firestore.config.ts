import type { MapProgress } from "@/common/stores/player-progress/progress.storage";
import type { TowerTypes } from "@/common/enum/tower-types";

/** Nome da coleção Firestore onde os dados de usuário são persistidos. */
export const FIRESTORE_COLLECTION_USERS = "users";

/** Tower inventory (unlocked, equipped, discovered) */
export interface FirestoreTowerInventory {
  unlocked: TowerTypes[];
  equipped: TowerTypes[];
  discovered?: TowerTypes[];
}

/** Mission progress counters */
export interface FirestoreMissionCounters {
  kills: number;
  waves: number;
  buildsByTower: Record<string, number>;
  mapsCompleted: number[];
}

/** Mission progress */
export interface FirestoreMissionProgress {
  completed: Record<string, boolean>;
  counters: FirestoreMissionCounters;
  updatedAt: number;
}

/** Skill progress (unlocked, enabled 1–3) */
export interface FirestoreSkillProgress {
  unlocked: string[];
  enabled: string[];
}

/**
 * Estrutura do documento de usuário no Firestore.
 * Usado para sync de preferências e progresso (som, idioma, mapas, torres, missões, skills).
 */
export interface FirestoreUserDoc {
  mapProgress?: MapProgress[] | null;
  towerInventory?: FirestoreTowerInventory | null;
  missionProgress?: FirestoreMissionProgress | null;
  skillProgress?: FirestoreSkillProgress | null;
  sound: {
    masterVolume: number | null;
    groups: Record<string, number>;
  };
  language: string | null;
}

/** Garante que as chaves de grupos são do tipo SoundGroups ao ler/gravar. */
export function normalizeSoundGroups(
  groups: Record<string, number> | undefined,
  validGroups: readonly string[]
): Record<string, number> {
  if (!groups || typeof groups !== "object") return {};

  const out: Record<string, number> = {};

  for (const key of validGroups) {
    if (key in groups && typeof groups[key] === "number") {
      out[key] = groups[key];
    }
  }

  return out;
}

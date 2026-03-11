import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/common/providers/firebase";
import {
  FIRESTORE_COLLECTION_USERS,
  type FirestoreUserDoc,
  normalizeSoundGroups,
} from "@/common/firestore";
import {
  loadGroupVolume,
  loadMasterVolume,
  saveGroupVolume,
  saveMasterVolume,
} from "@/common/stores/sound/sound.storage";
import {
  loadMapProgress,
  saveMapProgress,
} from "@/common/stores/player-progress/progress.storage";
import {
  loadTowerInventory,
  saveTowerInventory,
} from "@/common/stores/tower-inventory/tower-inventory.storage";
import {
  loadMissionProgress,
  saveMissionProgress,
} from "@/common/stores/missions/mission-progress.storage";
import {
  loadSkillProgress,
  saveSkillProgress,
} from "@/common/stores/skill-progress/skill-progress.storage";
import { loadLanguage, saveLanguage } from "@/common/stores/lang/lang.storage";
import { type SkillId, SKILL_IDS_ORDER } from "@/common/enum/skill-ids";
import { SoundGroups } from "@/common/enum/sound-groups";

const VALID_SKILL_IDS = new Set<string>(SKILL_IDS_ORDER);

/**
 * Sincroniza dados locais (Capacitor Storage) para o Firestore.
 * Grava no documento users/{userId} com merge para não sobrescrever outros campos.
 */
export async function syncFromLocal(
  userId: string,
  syncProgress: boolean = false
): Promise<void> {
  const masterVolume = await loadMasterVolume();
  const groupVolumes: Record<string, number> = {};

  for (const group of Object.values(SoundGroups)) {
    const vol = await loadGroupVolume(group);
    if (vol !== null) groupVolumes[group] = vol;
  }
  const language = await loadLanguage();

  const payload: FirestoreUserDoc = {
    sound: {
      masterVolume,
      groups: groupVolumes,
    },
    language,
  };

  if (syncProgress) {
    const mapProgress = await loadMapProgress();
    payload.mapProgress = mapProgress ?? null;

    const towerInventory = await loadTowerInventory();
    payload.towerInventory = towerInventory ?? null;

    const missionProgress = await loadMissionProgress();
    payload.missionProgress = missionProgress ?? null;

    const skillProgress = await loadSkillProgress();
    payload.skillProgress = skillProgress ?? null;
  }

  const userRef = doc(db, FIRESTORE_COLLECTION_USERS, userId);
  await setDoc(userRef, payload, { merge: true });
}

/**
 * Sincroniza do Firestore para o armazenamento local (Capacitor Storage).
 * Lê o documento users/{userId} e aplica som, idioma e progresso de mapas.
 */
export async function syncFromRemote(userId: string): Promise<void> {
  const userRef = doc(db, FIRESTORE_COLLECTION_USERS, userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const data = snap.data() as FirestoreUserDoc;

  if (data.sound?.masterVolume !== undefined && data.sound.masterVolume !== null) {
    await saveMasterVolume(data.sound.masterVolume);
  }

  const validGroups = Object.values(SoundGroups);
  const groups = normalizeSoundGroups(data.sound?.groups, validGroups);
  for (const [group, volume] of Object.entries(groups)) {
    await saveGroupVolume(group as SoundGroups, Number(volume));
  }

  if (Array.isArray(data.mapProgress)) {
    await saveMapProgress(data.mapProgress);
  }

  if (data.towerInventory && typeof data.towerInventory === "object") {
    const inv = data.towerInventory;
    if (Array.isArray(inv.unlocked) && Array.isArray(inv.equipped)) {
      await saveTowerInventory({
        unlocked: inv.unlocked,
        equipped: inv.equipped,
        discovered: Array.isArray(inv.discovered) ? inv.discovered : undefined,
      });
    }
  }

  if (data.missionProgress && typeof data.missionProgress === "object") {
    const mp = data.missionProgress;
    const completed =
      typeof mp.completed === "object" && mp.completed !== null ? mp.completed : undefined;
    const counters =
      mp.counters && typeof mp.counters === "object"
        ? {
            kills: Number(mp.counters.kills) || 0,
            waves: Number(mp.counters.waves) || 0,
            buildsByTower:
              mp.counters.buildsByTower && typeof mp.counters.buildsByTower === "object"
                ? mp.counters.buildsByTower
                : {},
            mapsCompleted: Array.isArray(mp.counters.mapsCompleted)
              ? mp.counters.mapsCompleted.map(Number)
              : [],
          }
        : undefined;
    if (completed !== undefined && counters !== undefined) {
      await saveMissionProgress({
        completed,
        counters,
        updatedAt: Number(mp.updatedAt) || Date.now(),
      });
    }
  }

  if (data.skillProgress && typeof data.skillProgress === "object") {
    const sp = data.skillProgress;
    if (Array.isArray(sp.unlocked) && Array.isArray(sp.enabled)) {
      const unlocked = sp.unlocked.filter(
        (id): id is SkillId => typeof id === "string" && VALID_SKILL_IDS.has(id)
      );
      const enabled = sp.enabled.filter(
        (id): id is SkillId => typeof id === "string" && VALID_SKILL_IDS.has(id)
      );
      if (unlocked.length > 0 || enabled.length > 0) {
        await saveSkillProgress({ unlocked, enabled });
      }
    }
  }

  if (typeof data.language === "string") {
    await saveLanguage(data.language);
  }
}

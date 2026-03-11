import { TowerTypes } from "@/common/enum/tower-types";
import type { FirestoreMissionCatalogDoc } from "@/common/firestore/catalog/catalog.types";
import type { MissionProgress } from "@/common/stores/missions/mission-progress.storage";
import { useCatalogStore } from "@/common/stores/catalog/catalog.store";
import { useInventoryStore } from "@/common/stores/inventory/inventory.store";
import { useSkillProgressStore } from "@/common/stores/skill-progress/skill-progress.store";

/**
 * Checks if a mission target is satisfied by current progress.
 */
function isMissionTargetMet(
  mission: FirestoreMissionCatalogDoc,
  progress: MissionProgress
): boolean {
  const { type, target } = mission;
  const { counters, completed } = progress;

  if (completed[mission.id]) return false;

  switch (type) {
    case "map-complete": {
      const t = target as { mapId: number };
      return counters.mapsCompleted.includes(t.mapId);
    }
    case "kill-count": {
      const t = target as { count: number };
      return counters.kills >= t.count;
    }
    case "wave-count": {
      const t = target as { count: number };
      return counters.waves >= t.count;
    }
    case "tower-build": {
      const t = target as { towerId: TowerTypes; count: number };
      const built = counters.buildsByTower[t.towerId] ?? 0;
      return built >= t.count;
    }
    case "manual":
      return false;
    default:
      return false;
  }
}

/**
 * Evaluates all missions and applies rewards for newly completed ones.
 * Call after updating mission progress (kills, waves, builds, map complete).
 */
export async function evaluateAndApplyMissions(): Promise<void> {
  const missions = useCatalogStore.getState().missions;
  const progress = useInventoryStore.getState().getMissionProgress();
  const { updateMissionProgress, unlockTower } = useInventoryStore.getState();
  const { unlockSkill } = useSkillProgressStore.getState();

  if (!progress || missions.length === 0) return;

  for (const mission of missions) {
    if (!mission.enabled) continue;
    if (progress.completed[mission.id]) continue;

    if (!isMissionTargetMet(mission, progress)) continue;

    const rewards = mission.rewards;
    if (rewards?.unlockTowers?.length) {
      for (const towerId of rewards.unlockTowers) {
        await unlockTower(towerId as TowerTypes);
      }
    }
    if (rewards?.unlockSkills?.length) {
      for (const skillId of rewards.unlockSkills) {
        await unlockSkill(skillId);
      }
    }

    await updateMissionProgress((prev) => ({
      ...prev,
      completed: { ...prev.completed, [mission.id]: true },
    }));
  }
}

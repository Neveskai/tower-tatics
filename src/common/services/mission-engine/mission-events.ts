import { TowerTypes } from "@/common/enum/tower-types";
import { useInventoryStore } from "@/common/stores/inventory/inventory.store";
import { evaluateAndApplyMissions } from "./mission-engine.service";

/**
 * Record a monster kill. Call from game when monster dies (player killed it).
 */
export async function recordKill(): Promise<void> {
  const { updateMissionProgress } = useInventoryStore.getState();
  await updateMissionProgress((prev) => ({
    ...prev,
    counters: {
      ...prev.counters,
      kills: prev.counters.kills + 1,
    },
  }));
  await evaluateAndApplyMissions();
}

/**
 * Record a wave/horde completed. Call when a new wave is spawned.
 */
export async function recordWave(): Promise<void> {
  const { updateMissionProgress } = useInventoryStore.getState();
  await updateMissionProgress((prev) => ({
    ...prev,
    counters: {
      ...prev.counters,
      waves: prev.counters.waves + 1,
    },
  }));
  await evaluateAndApplyMissions();
}

/**
 * Record a tower built. Call when player places a tower.
 */
export async function recordTowerBuild(towerType: TowerTypes): Promise<void> {
  const { updateMissionProgress } = useInventoryStore.getState();
  await updateMissionProgress((prev) => {
    const key = towerType;
    const current = prev.counters.buildsByTower[key] ?? 0;
    return {
      ...prev,
      counters: {
        ...prev.counters,
        buildsByTower: {
          ...prev.counters.buildsByTower,
          [key]: current + 1,
        },
      },
    };
  });
  await evaluateAndApplyMissions();
}

/**
 * Record a map completed. Call when player finishes all waves of a map.
 */
export async function recordMapComplete(mapId: number): Promise<void> {
  const { updateMissionProgress } = useInventoryStore.getState();
  await updateMissionProgress((prev) => {
    const mapsCompleted = prev.counters.mapsCompleted.includes(mapId)
      ? prev.counters.mapsCompleted
      : [...prev.counters.mapsCompleted, mapId];
    return {
      ...prev,
      counters: {
        ...prev.counters,
        mapsCompleted,
      },
    };
  });
  await evaluateAndApplyMissions();
}

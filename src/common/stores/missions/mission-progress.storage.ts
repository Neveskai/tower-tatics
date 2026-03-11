import { Storage } from "@capacitor/storage";

const MISSION_PROGRESS_KEY = "mission_progress";

export interface MissionCounters {
  kills: number;
  waves: number;
  buildsByTower: Record<string, number>;
  mapsCompleted: number[];
}

export interface MissionProgress {
  completed: Record<string, boolean>;
  counters: MissionCounters;
  updatedAt: number;
}

const DEFAULT_COUNTERS: MissionCounters = {
  kills: 0,
  waves: 0,
  buildsByTower: {},
  mapsCompleted: [],
};

export async function saveMissionProgress(progress: MissionProgress): Promise<void> {
  await Storage.set({
    key: MISSION_PROGRESS_KEY,
    value: JSON.stringify(progress),
  });
}

export async function loadMissionProgress(): Promise<MissionProgress | null> {
  const { value } = await Storage.get({ key: MISSION_PROGRESS_KEY });
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as MissionProgress;
    return {
      completed: parsed.completed ?? {},
      counters: {
        kills: parsed.counters?.kills ?? 0,
        waves: parsed.counters?.waves ?? 0,
        buildsByTower: parsed.counters?.buildsByTower ?? {},
        mapsCompleted: parsed.counters?.mapsCompleted ?? [],
      },
      updatedAt: parsed.updatedAt ?? Date.now(),
    };
  } catch {
    return null;
  }
}

export function createEmptyMissionProgress(): MissionProgress {
  return {
    completed: {},
    counters: { ...DEFAULT_COUNTERS },
    updatedAt: Date.now(),
  };
}

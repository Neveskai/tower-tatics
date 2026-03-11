import { Storage } from "@capacitor/storage";

const MAP_PROGRESS_KEY = "map_progress";

export type MapProgress = { id: number; unlocked: boolean };

export async function saveMapProgress(progress: MapProgress[]) {
  await Storage.set({
    key: MAP_PROGRESS_KEY,
    value: JSON.stringify(progress),
  });
}

export async function loadMapProgress(): Promise<MapProgress[] | null> {
  const { value } = await Storage.get({ key: MAP_PROGRESS_KEY });
  if (!value) return null;
  try {
    return JSON.parse(value) as MapProgress[];
  } catch {
    return null;
  }
}

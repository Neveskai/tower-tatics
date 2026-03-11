import { create } from "zustand";
import { MapWithUnlock, UserState } from "./player.types";

import { getMaps } from "@/common/assets/maps-assets";
import {
  loadMapProgress,
  MapProgress,
  saveMapProgress,
} from "../player-progress/progress.storage";
import {
  syncFromLocal,
  syncFromRemote,
} from "@/common/functions/firebase-sync";

export const usePlayerStore = create<UserState>((set, get) => ({
  user: null,
  setUser: (value) => set({ user: value }),

  authModal: false,
  setAuthModal: (value) => set({ authModal: value }),

  configModal: false,
  setConfigModal: (value) => set({ configModal: value }),

  selectedMapIndex: 0,
  setSelectedMapIndex: (index) => set({ selectedMapIndex: index }),

  maps: [],
  getMaps: async () => {
    const { user } = get();
    if (user) {
      await syncFromRemote(user.uid);
    }

    const defaultMaps = getMaps();
    let progress = await loadMapProgress();

    if (!progress) {
      progress = defaultMaps.map((map, i) => ({
        id: map.id,
        unlocked: i === 0,
      }));
      await saveMapProgress(progress);
      if (user) {
        await syncFromLocal(user.uid, true);
      }
    }

    const mapsWithUnlock: MapWithUnlock[] = defaultMaps.map((map) => {
      const found = progress!.find((m) => m.id === map.id);
      return {
        ...map,
        unlocked: found?.unlocked ?? false,
      };
    });

    set({ maps: mapsWithUnlock });
  },
  unlockMap: async (mapId: number) => {
    const { maps, user } = get();
    const updatedMaps = maps.map((map) =>
      map.id === mapId ? { ...map, unlocked: true } : map
    );

    set({ maps: updatedMaps });

    const progressToSave: MapProgress[] = updatedMaps.map(
      ({ id, unlocked }) => ({
        id,
        unlocked,
      })
    );

    await saveMapProgress(progressToSave);

    if (user) {
      await syncFromLocal(user.uid, true)
    }
  },
}));

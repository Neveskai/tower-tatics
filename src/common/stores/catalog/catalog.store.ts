import { create } from "zustand";
import { TowerTypes } from "@/common/enum/tower-types";
import type { TowerConfig } from "@/common/firestore/catalog/catalog.types";
import {
  loadTowerCatalog,
  loadMissionCatalog,
} from "@/common/firestore/catalog/catalog.loader";
import type { CatalogState } from "./catalog-store.types";

export const useCatalogStore = create<CatalogState>((set, get) => ({
  towerConfigs: null,
  towerOrder: null,
  missions: [],
  loading: false,
  loaded: false,

  loadCatalog: async () => {
    const { loading, loaded } = get();
    if (loading || loaded) return;

    set({ loading: true });
    try {
      const [towerResult, missions] = await Promise.all([
        loadTowerCatalog(),
        loadMissionCatalog(),
      ]);
      set({
        towerConfigs: towerResult.configs,
        towerOrder: towerResult.order,
        missions,
        loaded: true,
      });
    } catch (err) {
      set({ loading: false });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  getTowerConfig: (type: TowerTypes): TowerConfig => {
    const { towerConfigs } = get();
    if (!towerConfigs) {
      throw new Error("Tower catalog not loaded. Ensure loadCatalog() succeeded before using getTowerConfig.");
    }
    const config = towerConfigs[type];
    if (!config) {
      throw new Error(`Tower config not found for type: ${type}. Ensure catalog_towers is seeded.`);
    }
    return config;
  },

  getTowerOrder: (): TowerTypes[] => {
    const { towerOrder } = get();
    if (!towerOrder?.length) {
      throw new Error("Tower order not loaded. Ensure loadCatalog() succeeded before using getTowerOrder.");
    }
    return towerOrder;
  },
}));

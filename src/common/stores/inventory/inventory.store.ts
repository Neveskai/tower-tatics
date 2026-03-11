import { create } from "zustand";
import { TowerTypes } from "@/common/enum/tower-types";
import type { TowerInventory } from "@/common/stores/tower-inventory";
import type { MissionProgress } from "@/common/stores/missions/mission-progress.storage";
import {
  loadTowerInventory,
  saveTowerInventory,
  clampEquipped,
} from "@/common/stores/tower-inventory";
import {
  loadMissionProgress,
  saveMissionProgress,
  createEmptyMissionProgress,
} from "@/common/stores/missions/mission-progress.storage";
import { usePlayerStore } from "@/common/stores/player/player.store";
import { syncFromLocal } from "@/common/functions/firebase-sync";

const MAX_EQUIPPED = 4;
const DEFAULT_INITIAL_TOWER = TowerTypes.MACHINE_GUN;

export interface InventoryState {
  towerInventory: TowerInventory | null;
  missionProgress: MissionProgress | null;
  loaded: boolean;
  loadInventory: () => Promise<void>;
  equipTower: (type: TowerTypes) => Promise<void>;
  unequipTower: (type: TowerTypes) => Promise<void>;
  getEquippedTowers: () => TowerTypes[];
  getUnlockedTowers: () => TowerTypes[];
  getDiscoveredTowers: () => TowerTypes[];
  unlockTower: (type: TowerTypes) => Promise<void>;
  discoverTower: (type: TowerTypes) => Promise<void>;
  updateMissionProgress: (updater: (prev: MissionProgress) => MissionProgress) => Promise<void>;
  getMissionProgress: () => MissionProgress | null;
}

async function syncProgressIfLoggedIn(): Promise<void> {
  const user = usePlayerStore.getState().user;
  if (user) {
    await syncFromLocal(user.uid, true);
  }
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  towerInventory: null,
  missionProgress: null,
  loaded: false,

  loadInventory: async () => {
    let inventory = await loadTowerInventory();
    let missionProgress = await loadMissionProgress();

    if (!inventory) {
      inventory = {
        unlocked: [DEFAULT_INITIAL_TOWER],
        equipped: [DEFAULT_INITIAL_TOWER],
        discovered: [DEFAULT_INITIAL_TOWER],
      };
      await saveTowerInventory(inventory);
      await syncProgressIfLoggedIn();
    }

    if (!missionProgress) {
      missionProgress = createEmptyMissionProgress();
      await saveMissionProgress(missionProgress);
      await syncProgressIfLoggedIn();
    }

    set({ towerInventory: inventory, missionProgress, loaded: true });
  },

  equipTower: async (type: TowerTypes) => {
    const { towerInventory } = get();
    if (!towerInventory) return;
    if (!towerInventory.unlocked.includes(type)) return;

    let equipped = [...towerInventory.equipped];
    if (equipped.includes(type)) return;

    if (equipped.length >= MAX_EQUIPPED) return;

    equipped = [...equipped, type].slice(0, MAX_EQUIPPED);
    const updated = { ...towerInventory, equipped };
    await saveTowerInventory(updated);
    set({ towerInventory: updated });
    await syncProgressIfLoggedIn();
  },

  unequipTower: async (type: TowerTypes) => {
    const { towerInventory } = get();
    if (!towerInventory) return;

    const equipped = towerInventory.equipped.filter((t) => t !== type);
    const updated = { ...towerInventory, equipped };
    await saveTowerInventory(updated);
    set({ towerInventory: updated });
    await syncProgressIfLoggedIn();
  },

  getEquippedTowers: (): TowerTypes[] => {
    const { towerInventory } = get();
    if (!towerInventory) return [DEFAULT_INITIAL_TOWER];
    return towerInventory.equipped.length > 0
      ? clampEquipped(towerInventory.equipped)
      : [DEFAULT_INITIAL_TOWER];
  },

  getUnlockedTowers: (): TowerTypes[] => {
    const { towerInventory } = get();
    return towerInventory?.unlocked ?? [DEFAULT_INITIAL_TOWER];
  },

  getDiscoveredTowers: (): TowerTypes[] => {
    const { towerInventory } = get();
    return towerInventory?.discovered ?? [DEFAULT_INITIAL_TOWER];
  },

  unlockTower: async (type: TowerTypes) => {
    const { towerInventory } = get();
    if (!towerInventory) return;
    if (towerInventory.unlocked.includes(type)) return;

    const unlocked = [...towerInventory.unlocked, type];
    const discovered = towerInventory.discovered?.includes(type)
      ? towerInventory.discovered
      : [...(towerInventory.discovered ?? []), type];
    const updated = { ...towerInventory, unlocked, discovered };
    await saveTowerInventory(updated);
    set({ towerInventory: updated });
    await syncProgressIfLoggedIn();
  },

  discoverTower: async (type: TowerTypes) => {
    const { towerInventory } = get();
    if (!towerInventory) return;
    if (towerInventory.discovered?.includes(type)) return;

    const discovered = [...(towerInventory.discovered ?? []), type];
    const updated = { ...towerInventory, discovered };
    await saveTowerInventory(updated);
    set({ towerInventory: updated });
    await syncProgressIfLoggedIn();
  },

  updateMissionProgress: async (
    updater: (prev: MissionProgress) => MissionProgress
  ) => {
    const { missionProgress } = get();
    const prev = missionProgress ?? createEmptyMissionProgress();
    const updated = updater(prev);
    updated.updatedAt = Date.now();
    await saveMissionProgress(updated);
    set({ missionProgress: updated });
    await syncProgressIfLoggedIn();
  },

  getMissionProgress: (): MissionProgress | null => {
    return get().missionProgress;
  },
}));

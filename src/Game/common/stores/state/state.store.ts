import { create } from "zustand";
import { GameState } from "./state.types";
import { HudModes } from "@/common/enum/hud-modes";
import { INITIAL_PLAYER_HEALTH } from "../../constants/player.constants";
import { INITIAL_HORDE } from "../../constants/monsters.constants";

const DEFAULT_INTERVAL_MS = 30000;

export const useGameStore = create<GameState>((set, get) => ({
  playerHealth: INITIAL_PLAYER_HEALTH,
  currentHorde: INITIAL_HORDE,

  isSending: false,
  setIsSending: (value) => set({ isSending: value }),

  pauseStart: null,
  setPauseStart: (value) => set({ pauseStart: value }),

  spawning: false,
  setSpawning: (value) => set({ spawning: value }),

  mode: HudModes.SHOP,
  setMode: (mode) => {
    const { selectedTower, previewTower, setSelectedTowerType } = get();

    if (mode === HudModes.MONSTER) {
      setSelectedTowerType(null);
      if (selectedTower) selectedTower?.hideRangeIndicator();
      if (previewTower) previewTower.visible = false;
    } else if (mode === HudModes.TOWER) {
      setSelectedTowerType(null);
      if (selectedTower) selectedTower?.drawRangeIndicator();
    } else if (mode === HudModes.SHOP) {
      if (selectedTower) selectedTower?.hideRangeIndicator();
      if (previewTower) previewTower.visible = false;
    }

    set({ mode });
  },
  toggleMode: () => {
    const { mode, setMode } = get();

    if (mode === HudModes.SHOP) setMode(HudModes.MONSTER);
    else if (mode === HudModes.MONSTER) setMode(HudModes.TOWER);
    else if (mode === HudModes.TOWER) setMode(HudModes.SHOP);
  },

  setPlayerHealth: (value) => set({ playerHealth: value }),
  decrementPlayerHealth: (value) =>
    set((state) => ({
      playerHealth: Math.max(0, state.playerHealth - value),
    })),
  incrementHorde: () =>
    set((state) => ({
      currentHorde: state.currentHorde + 1,
    })),

  pause: true,
  setPause: (value) => {
    const { previewTower } = get();
    if (previewTower) previewTower.visible = false;
    set({ pause: value });
  },

  countdown: 0,
  intervalMs: DEFAULT_INTERVAL_MS,
  setCountdown: (value) => set({ countdown: value }),
  decrementCountdown: () =>
    set((state) => ({
      countdown: Math.max(0, state.countdown - 1),
    })),
  resetCountdown: () =>
    set((state) => ({
      countdown: state.intervalMs / 1000,
    })),
  setIntervalMs: (ms) => set({ intervalMs: ms }),

  hasActiveMonsters: false,
  setHasActiveMonsters: (value) => set({ hasActiveMonsters: value }),

  previewTower: null,
  setPreviewTower: (tower) => set({ previewTower: tower }),

  selectedTower: null,
  setSelectedTower: (tower) => {
    const { previewTower } = get();
    if (previewTower) previewTower.visible = false;
    set({ selectedTower: tower });
  },

  selectedMonster: null,
  setSelectedMonster: (monster) => {
    set({ selectedMonster: monster });
  },

  gameController: null,
  setGameController: (gameController) =>
    set({ gameController: gameController }),

  selectedTowerType: null,
  setSelectedTowerType: (type) => set({ selectedTowerType: type }),

  activeSkill: null,
  setActiveSkill: (skill) => set({ activeSkill: skill }),

  resetStore: () => {
    set({
      countdown: 0,
      intervalMs: DEFAULT_INTERVAL_MS,
      pause: true,
      isSending: false,
      playerHealth: INITIAL_PLAYER_HEALTH,
      currentHorde: INITIAL_HORDE,
      pauseStart: null,
      spawning: false,
      mode: HudModes.SHOP,
      gameController: null,
      hasActiveMonsters: false,
      selectedTower: null,
      selectedMonster: null,
      selectedTowerType: null,
      activeSkill: null,
    });
  },
}));

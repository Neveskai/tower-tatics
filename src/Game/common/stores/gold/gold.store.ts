import { create } from "zustand";
import { GoldState } from "./gold.types";
import { INITIAL_PLAYER_GOLD } from "../../constants/player.constants";

export const useGoldStore = create<GoldState>((set) => ({
  playerGold: INITIAL_PLAYER_GOLD,

  setPlayerGold: (value) => set({ playerGold: value }),
  
  incrementPlayerGold: (value) =>
    set((state) => ({
      playerGold: state.playerGold + value,
    })),

  decrementPlayerGold: (value) =>
    set((state) => ({
      playerGold: state.playerGold - value,
    })),

  resetGold: () => {
    set({ playerGold: INITIAL_PLAYER_GOLD });
  },
}));

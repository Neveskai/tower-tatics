export interface GoldState {
  playerGold: number;
  setPlayerGold: (value: number) => void;
  incrementPlayerGold: (value: number) => void;
  decrementPlayerGold: (value: number) => void;
  
  resetGold: () => void;
}

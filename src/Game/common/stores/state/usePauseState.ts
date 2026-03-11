import { useGameStore } from "./state.store";
import {
  canInteractWithBoard,
  getWaveButtonMode,
  isGameRunning,
  isPausedMidWave,
  isPreGame,
} from "./pause.selectors";

export function usePauseState() {
  const pause = useGameStore((s) => s.pause);
  const currentHorde = useGameStore((s) => s.currentHorde);
  const hasActiveMonsters = useGameStore((s) => s.hasActiveMonsters);
  const isSending = useGameStore((s) => s.isSending);
  const slice = { pause, currentHorde, hasActiveMonsters };
  const waveButtonSlice = {
    ...slice,
    hasActiveMonsters: hasActiveMonsters ?? false,
    isSending,
  };
  return {
    ...slice,
    isGameRunning: isGameRunning(slice),
    isPausedMidWave: isPausedMidWave(slice),
    isPreGame: isPreGame(slice),
    canInteractWithBoard: canInteractWithBoard(slice),
    waveButtonMode: getWaveButtonMode(waveButtonSlice),
  };
}

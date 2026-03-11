import type { PauseStateSlice, WaveButtonMode, WaveButtonStateSlice } from "./pause.types";

export function isGameRunning(state: PauseStateSlice): boolean {
  return !state.pause;
}

export function isPausedMidWave(state: PauseStateSlice): boolean {
  return state.pause && state.currentHorde > 0;
}

export function isPreGame(state: PauseStateSlice): boolean {
  return state.pause && state.currentHorde === 0;
}

/**
 * Used for: placement, tower/monster click, shop interaction, tower HUD.
 */
export function canInteractWithBoard(state: PauseStateSlice): boolean {
  return !isPausedMidWave(state);
}

export function getWaveButtonMode(
  state: WaveButtonStateSlice
): WaveButtonMode | null {
  const { pause, currentHorde, hasActiveMonsters, isSending } = state;
  if (isSending) return null;
  if (currentHorde === 0 && pause) return "start";
  if (pause && currentHorde > 0) return "resume";
  if (!pause && hasActiveMonsters) return "pause";
  if (!pause && !hasActiveMonsters) return "sendNext";
  return null;
}

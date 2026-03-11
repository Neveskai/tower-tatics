/**
 * Minimal state slice for pause-related rules. Used by selectors so callers
 * don't need to depend on full GameState.
 */
export interface PauseStateSlice {
  pause: boolean;
  currentHorde: number;
  hasActiveMonsters?: boolean;
}

export type WaveButtonMode = "start" | "resume" | "pause" | "sendNext";

export interface WaveButtonStateSlice extends PauseStateSlice {
  hasActiveMonsters: boolean;
  isSending?: boolean;
}

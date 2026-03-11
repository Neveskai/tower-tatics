import { TowerTypes } from "@/common/enum/tower-types";
import { TowerPreview } from "@/Game/Render";
import { GameController } from "@/Game/game.controller";
import { MonsterCharacter } from "@/Game/Character/Monster";
import { TowerCharacter } from "@/Game/Character/Tower";
import { HudModes } from "@/common/enum/hud-modes";

export interface HoveredCell {
  row: number;
  col: number;
}

export type HudStatsActive = 'tower' | 'monster'

export type ActiveSkillId = 'blizzard' | null

export interface GameState {
  playerHealth: number;
  setPlayerHealth: (value: number) => void;
  decrementPlayerHealth: (value: number) => void;

  currentHorde: number;
  incrementHorde: () => void;

  isSending: boolean,
  setIsSending: (value: boolean) => void;

  pauseStart: number | null;
  setPauseStart: (value: number | null) => void;

  mode: HudModes,
  setMode: (value: HudModes) => void;
  toggleMode: () => void;

  spawning: boolean,
  setSpawning: (value: boolean) => void;

  // Spawn countdown
  countdown: number;
  intervalMs: number;
  setCountdown: (value: number) => void;
  decrementCountdown: () => void;
  resetCountdown: () => void;
  setIntervalMs: (ms: number) => void;

  // Monster tracking
  pause: boolean;
  setPause: (value: boolean) => void;

  hasActiveMonsters: boolean;
  setHasActiveMonsters: (value: boolean) => void;

  previewTower: TowerPreview | null;
  setPreviewTower: (tower: TowerPreview) => void;

  gameController: GameController | null;
  setGameController: (tower: GameController) => void;

  selectedTowerType: TowerTypes | null;
  setSelectedTowerType: (type: TowerTypes | null) => void;

  selectedTower: TowerCharacter | null;
  setSelectedTower: (tower: TowerCharacter | null) => void;

  selectedMonster: MonsterCharacter | null;
  setSelectedMonster: (tower: MonsterCharacter | null) => void;

  activeSkill: ActiveSkillId;
  setActiveSkill: (skill: ActiveSkillId) => void;

  resetStore: () => void;
}

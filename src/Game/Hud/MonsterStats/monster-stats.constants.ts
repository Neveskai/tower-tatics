import { MonsterCharacter } from "@/Game/Character/Monster";

export const EMPTY_MONSTER = {
  baseSpeed: 0,
  currHealth: 0,
  maxHealth: 0,
  gold: 0,
  type: "slime" as const,
  size: "normal" as const,
  onHealthChange: () => () => false,
} as unknown as MonsterCharacter;

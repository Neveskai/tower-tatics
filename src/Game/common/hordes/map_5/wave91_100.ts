import { MonsterConfig } from "@/Game/common/types/monsters.types";
import {
  BASE_HEALT,
  FAST,
  NORMAL,
  SLOW,
  VERY_FAST,
} from "@/Game/common/constants/monsters.constants";

const WAVE_BASE_HEALT = BASE_HEALT * 501;
const WAVE_BASE_GOLD = 10;
const WAVE_BASE_SPAWN = 12;
const BASE_SPAWN_DURATION = 5000;

export const wave_91_100: MonsterConfig[] = [
  {
    wave_id: 1,
    type: "orcLord",
    size: "small",
    spawnDuration: BASE_SPAWN_DURATION,
    gold: WAVE_BASE_GOLD,
    speed: VERY_FAST,
    maxHealth: WAVE_BASE_HEALT * 3,
    spawnPerSide: WAVE_BASE_SPAWN,
  },
  {
    wave_id: 2,
    type: "plantFire",
    size: "normal",
    spawnDuration: BASE_SPAWN_DURATION,
    gold: WAVE_BASE_GOLD + 1,
    speed: SLOW,
    maxHealth: WAVE_BASE_HEALT * 3,
    spawnPerSide: WAVE_BASE_SPAWN - 1,
    special: {
      resistToSlow: true,
      resistToStun: true,
    }
  },
  {
    wave_id: 3,
    type: "slimeVulcan",
    size: "normal",
    spawnDuration: BASE_SPAWN_DURATION,
    gold: WAVE_BASE_GOLD,
    speed: SLOW,
    maxHealth: WAVE_BASE_HEALT * 4,
    spawnPerSide: WAVE_BASE_SPAWN - 1,
    special: {
      resistToSlow: true,
      resistToStun: true,
      spawnsOnDeath: [
        {
          wave_id: 1,
          type: "slimeBoned",
          size: "small",
          spawnDuration: BASE_SPAWN_DURATION,
          gold: 1,
          speed: FAST,
          maxHealth: WAVE_BASE_HEALT * 1.5,
          spawnPerSide: WAVE_BASE_SPAWN,
        },
      ],
    },
  },
  {
    wave_id: 4,
    type: "plantFire",
    size: "normal",
    spawnDuration: BASE_SPAWN_DURATION,
    gold: WAVE_BASE_GOLD,
    speed: NORMAL,
    maxHealth: WAVE_BASE_HEALT * 3.5,
    spawnPerSide: WAVE_BASE_SPAWN - 1,
  },
  {
    wave_id: 5,
    type: "slimeVulcan",
    size: "demonic",
    spawnDuration: BASE_SPAWN_DURATION / 2,
    gold: WAVE_BASE_GOLD * 24,
    speed: FAST,
    maxHealth: WAVE_BASE_HEALT * 48,
    spawnPerSide: 1,
    special: {
      resistToSlow: true,
    },
  },
  {
    wave_id: 6,
    type: "plantFire",
    size: "normal",
    spawnDuration: BASE_SPAWN_DURATION,
    gold: WAVE_BASE_GOLD,
    speed: NORMAL,
    maxHealth: WAVE_BASE_HEALT * 1.5,
    spawnPerSide: WAVE_BASE_SPAWN,
  },
  {
    wave_id: 17,
    type: "slimeVulcan",
    size: "big",
    spawnDuration: BASE_SPAWN_DURATION,
    gold: WAVE_BASE_GOLD + 1,
    speed: NORMAL,
    maxHealth: WAVE_BASE_HEALT * 7,
    spawnPerSide: WAVE_BASE_SPAWN - 1,
    special: {
      spawnsPerTime: [
        {
          wave_id: 1,
          type: "slimeBoned",
          size: "small",
          spawnDuration: BASE_SPAWN_DURATION,
          gold: 1,
          speed: VERY_FAST,
          maxHealth: WAVE_BASE_HEALT * 1.5,
          spawnPerSide: WAVE_BASE_SPAWN,
        },
      ],
    },
  },
  {
    wave_id: 8,
    type: "slimeBoned",
    size: "small",
    spawnDuration: BASE_SPAWN_DURATION,
    gold: WAVE_BASE_GOLD,
    speed: FAST,
    maxHealth: WAVE_BASE_HEALT * 3.5,
    spawnPerSide: WAVE_BASE_SPAWN,
  },
  {
    wave_id: 9,
    type: "plantFire",
    size: "normal",
    spawnDuration: BASE_SPAWN_DURATION,
    gold: WAVE_BASE_GOLD,
    speed: FAST,
    maxHealth: WAVE_BASE_HEALT * 3.5,
    spawnPerSide: WAVE_BASE_SPAWN + 2,
    special: {
      resistToSlow: true,
    },
  },
  {
    wave_id: 10,
    type: "bee",
    size: "small",
    spawnDuration: BASE_SPAWN_DURATION * 2,
    gold: WAVE_BASE_GOLD + 1,
    speed: FAST,
    maxHealth: WAVE_BASE_HEALT * 6.5,
    spawnPerSide: WAVE_BASE_SPAWN,
    air: true,
  },
  {
    wave_id: 101,
    type: "bee",
    size: "demonic",
    spawnDuration: BASE_SPAWN_DURATION,
    gold: WAVE_BASE_GOLD,
    speed: FAST,
    maxHealth: WAVE_BASE_HEALT * 50,
    spawnPerSide: 1,
    special: {
      resistToSlow: true,
      resistToStun: true,
      spawnsOnDeath: [
        {
          wave_id: 101,
          type: "bee",
          size: "big",
          spawnDuration: BASE_SPAWN_DURATION,
          gold: WAVE_BASE_GOLD,
          speed: NORMAL,
          maxHealth: WAVE_BASE_HEALT * 25,
          spawnPerSide: 1,
          special: {
            resistToSlow: true,
            resistToStun: true
          }
        },
      ],
    },
  },
];

/**
 * Exporta dados do jogo para JSON utilizável no Godot (WSN-55).
 * Executar: npx tsx scripts/export-godot-data.ts  (npm run export:godot)
 *
 * Saída: godot-export/data/  e cópia em godot/data/
 */

import * as fs from "fs";
import * as path from "path";
import {
  Map1Waves,
  Map2Waves,
  Map3Waves,
  Map4Waves,
  Map5Waves,
} from "../src/Game/common/hordes";
import type { MonsterConfig } from "../src/Game/common/types/monsters.types";
import {
  VERY_SLOW,
  SLOW,
  NORMAL,
  FAST,
  VERY_FAST,
  SMALL,
  MEDIUM,
  BIG,
  HUGE,
  DEMONIC,
  BASE_HEALT,
} from "../src/Game/common/constants/monsters.constants";
import { ROWS, COLS, CENTER_ROW } from "../src/Game/common/constants/cols.constants";
import {
  INITIAL_PLAYER_GOLD,
  INITIAL_PLAYER_HEALTH,
  LEAK_DAMAGE,
} from "../src/Game/common/constants/player.constants";
import {
  SKILL_COSTS,
  SKILL_MAX_SEGMENTS,
  SKILL_SEGMENT_REGEN_MS,
} from "../src/Game/common/constants/skills.constants";
import {
  BLIZZARD_DAMAGE_PER_TICK,
  BLIZZARD_DURATION_MS,
  BLIZZARD_SIZE,
  BLIZZARD_SLOW_DURATION,
  BLIZZARD_SLOW_FACTOR,
  BLIZZARD_TICK_INTERVAL_MS,
} from "../src/Game/Skills/Blizzard/blizzard-constants";
import { MAX_EQUIPPED } from "../src/common/stores/tower-inventory/tower-inventory.constants";
import { getTowerUnlockForMap } from "../src/common/constants/map-rewards.constants";
import { buildTowersJson } from "./godot-catalog-payload";

const OUT_DIR = path.join(process.cwd(), "godot-export", "data");
const GODOT_DATA_DIR = path.join(process.cwd(), "..", "tower-tatics-3D", "resources", "data");
const MAX_TOWER_LEVEL = 6;
const CAMERA_ELEVATION_DEG = 38;
const CAMERA_YAW_DEG = 42;
const TILE_SIZE_M = 1;
const SKILL_TICK_MS = 200;
const BLIZZARD_HIT_RADIUS = 5.5;
const MAX_ENABLED_SKILLS = 3;

function toGodotWaveConfig(wave: MonsterConfig): Record<string, unknown> {
  const entry: Record<string, unknown> = {
    wave_id: wave.wave_id,
    type: wave.type,
    size: wave.size,
    spawn_duration: wave.spawnDuration,
    gold: wave.gold,
    speed: wave.speed,
    max_health: wave.maxHealth,
    spawn_per_side: wave.spawnPerSide,
  };
  if (wave.air !== undefined) entry.air = wave.air;
  if (wave.special !== undefined) entry.special = wave.special;
  return entry;
}

const MAP_META: Array<{
  id: number;
  nome: string;
  descricao: string;
  dificuldade: string;
  hordas: number;
  wave_interval_seconds: number;
  imagem: string;
  grid_color: number;
  tile_tint: number;
  dirt_tint: number;
}> = [
  {
    id: 1,
    nome: "Desert",
    descricao: "An endless scorched land crawling with ancient horrors.",
    dificuldade: "easy",
    hordas: 10,
    wave_interval_seconds: 30,
    imagem: "res://assets/images/maps/Map_1.png",
    grid_color: 0x595959,
    tile_tint: 0xf2d7a0,
    dirt_tint: 0xc58b3a,
  },
  {
    id: 2,
    nome: "Cemetery",
    descricao: "A cursed graveyard where the dead refuse to rest.",
    dificuldade: "medium",
    hordas: 15,
    wave_interval_seconds: 24,
    imagem: "res://assets/images/maps/Map_2.png",
    grid_color: 0x464646,
    tile_tint: 0x6a7a6b,
    dirt_tint: 0x4c4f52,
  },
  {
    id: 3,
    nome: "Garden",
    descricao: "A garden overrun by corrupted nature.",
    dificuldade: "hard",
    hordas: 20,
    wave_interval_seconds: 18,
    imagem: "res://assets/images/maps/Map_3.png",
    grid_color: 0x595959,
    tile_tint: 0x88c96b,
    dirt_tint: 0x5e8f43,
  },
  {
    id: 4,
    nome: "Ice",
    descricao: "Frozen wasteland.",
    dificuldade: "very_hard",
    hordas: 25,
    wave_interval_seconds: 14,
    imagem: "res://assets/images/maps/Map_4.png",
    grid_color: 0x595959,
    tile_tint: 0xc8e8ff,
    dirt_tint: 0x7fb2ff,
  },
  {
    id: 5,
    nome: "Hell",
    descricao: "Nightmare realm.",
    dificuldade: "nightmare",
    hordas: 40,
    wave_interval_seconds: 12,
    imagem: "res://assets/images/maps/Map_5.png",
    grid_color: 0x464646,
    tile_tint: 0x803030,
    dirt_tint: 0xff7a3c,
  },
];

const WAVE_SETS: MonsterConfig[][] = [
  Map1Waves,
  Map2Waves.slice(0, 15),
  Map3Waves.slice(0, 20),
  Map4Waves.slice(0, 25),
  Map5Waves.slice(0, 40),
];

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const constants = {
    grid: {
      rows: ROWS,
      cols: COLS,
      portal_row_start: CENTER_ROW,
      portal_row_end: CENTER_ROW + 5,
      tile_size_m: TILE_SIZE_M,
    },
    camera: { elevation_deg: CAMERA_ELEVATION_DEG, yaw_deg: CAMERA_YAW_DEG },
    monster_speed: {
      VERY_SLOW,
      SLOW,
      NORMAL,
      FAST,
      VERY_FAST,
    },
    monster_size: { SMALL, MEDIUM, BIG, HUGE, DEMONIC },
    base_health: BASE_HEALT,
  };
  writeJson("constants.json", constants);

  // Um JSON por mapa (waves incluídas)
  for (let i = 0; i < MAP_META.length; i++) {
    const meta = MAP_META[i];
    const waves = WAVE_SETS[i].map(toGodotWaveConfig);
    const mapData = { ...meta, waves };
    const filename = `map_${meta.id}.json`;
    writeJson(filename, mapData);
  }

  const mapList = MAP_META.map((m) => ({
    id: m.id,
    nome: m.nome,
    descricao: m.descricao,
    dificuldade: m.dificuldade,
    hordas: m.hordas,
    wave_interval_seconds: m.wave_interval_seconds,
    imagem: m.imagem,
    grid_color: m.grid_color,
    tile_tint: m.tile_tint,
    dirt_tint: m.dirt_tint,
  }));
  writeJson("maps_list.json", mapList);

  writeJson("towers.json", buildTowersJson());
  writeJson("skills.json", {
    energy: {
      max_segments: SKILL_MAX_SEGMENTS,
      regen_ms: SKILL_SEGMENT_REGEN_MS,
      tick_ms: SKILL_TICK_MS,
      start: 0,
    },
    blizzard: {
      cost: SKILL_COSTS.blizzard,
      preview_tiles: BLIZZARD_SIZE,
      duration_ms: BLIZZARD_DURATION_MS,
      slow_factor: BLIZZARD_SLOW_FACTOR,
      slow_duration: BLIZZARD_SLOW_DURATION,
      damage_per_tick: BLIZZARD_DAMAGE_PER_TICK,
      tick_interval_ms: BLIZZARD_TICK_INTERVAL_MS,
      hit_radius: BLIZZARD_HIT_RADIUS,
    },
  });
  writeJson("player.json", {
    hp: INITIAL_PLAYER_HEALTH,
    gold: INITIAL_PLAYER_GOLD,
    leak_damage: LEAK_DAMAGE,
    max_tower_level: MAX_TOWER_LEVEL,
    max_equipped: MAX_EQUIPPED,
    energy_start: 0,
  });

  const mapsProgress: Record<string, { unlocked: boolean }> = {};
  const mapRewards: Record<string, { tower: string }> = {};
  for (let id = 1; id <= 5; id++) {
    mapsProgress[String(id)] = { unlocked: id === 1 };
    const reward = getTowerUnlockForMap(id);
    if (reward) mapRewards[String(id)] = { tower: reward };
  }
  writeJson("progression.json", {
    maps: mapsProgress,
    map_rewards: mapRewards,
    default_towers: {
      unlocked: ["machine-gun"],
      equipped: ["machine-gun"],
      discovered: ["machine-gun"],
    },
    default_skills: {
      unlocked: ["blizzard"],
      enabled: ["blizzard"],
      max_enabled: MAX_ENABLED_SKILLS,
    },
  });

  copyDir(OUT_DIR, GODOT_DATA_DIR);
  console.log("\nDone. Mirrored to tower-tatics-3D/resources/data/.");
}

function writeJson(filename: string, data: unknown) {
  fs.writeFileSync(path.join(OUT_DIR, filename), JSON.stringify(data, null, 2) + "\n");
  console.log("Written", filename);
}

function copyDir(from: string, to: string) {
  fs.mkdirSync(to, { recursive: true });
  for (const name of fs.readdirSync(from)) {
    fs.copyFileSync(path.join(from, name), path.join(to, name));
  }
}

main();

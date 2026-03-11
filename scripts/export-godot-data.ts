/**
 * Exporta dados do jogo (mapas, waves, constantes) para JSON
 * utilizável no Godot. Executar: npx tsx scripts/export-godot-data.ts
 *
 * Saída: godot-export/data/
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
import { ROWS, COLS } from "../src/Game/common/constants/cols.constants";

const OUT_DIR = path.join(process.cwd(), "godot-export", "data");

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

  // Constantes globais para Godot
  const constants = {
    grid: { rows: ROWS, cols: COLS },
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
  fs.writeFileSync(
    path.join(OUT_DIR, "constants.json"),
    JSON.stringify(constants, null, 2)
  );
  console.log("Written constants.json");

  // Um JSON por mapa (waves incluídas)
  for (let i = 0; i < MAP_META.length; i++) {
    const meta = MAP_META[i];
    const waves = WAVE_SETS[i].map(toGodotWaveConfig);
    const mapData = { ...meta, waves };
    const filename = `map_${meta.id}.json`;
    fs.writeFileSync(
      path.join(OUT_DIR, filename),
      JSON.stringify(mapData, null, 2)
    );
    console.log("Written", filename);
  }

  // Lista de mapas (só metadados, sem waves)
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
  fs.writeFileSync(
    path.join(OUT_DIR, "maps_list.json"),
    JSON.stringify(mapList, null, 2)
  );
  console.log("Written maps_list.json");

  console.log("\nDone. Copy folder godot-export/data/ to your Godot project (e.g. resources/data/).");
}

main();

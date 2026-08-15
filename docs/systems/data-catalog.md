# Catálogo e dados

## Onde vive cada dado

| Dado | Onde | Notas |
|---|---|---|
| Combate/economia/upgrades de torres | Firestore `catalog_towers` (2D) e `towers.json` (Godot) | Seed 2D: `yarn seed:catalog`. Godot: `npm run export:godot` |
| Definições de missões | Firestore `catalog_missions` | Opcional; `[]` se falhar |
| Progresso do usuário | `users/{uid}` + Capacitor Storage | mapProgress, towerInventory, missionProgress, skillProgress, som, idioma |
| Waves / monstros | `src/Game/common/hordes/` | Espelho JSON: `godot-export/data/map_N.json` (já fatiadas) |
| Meta de mapas | `maps-assets.ts` | Espelho: `maps_list.json` |
| Constantes de grid/speed/size | `cols.constants.ts`, `monsters.constants.ts` | Espelho: `constants.json` |
| Skills / blizzard | `skills.constants.ts`, `blizzard-constants.ts` | Espelho: `skills.json` |
| Player HP/gold/leak | `player.constants.ts` | Espelho: `player.json` |
| Map-rewards / unlock | `map-rewards.constants.ts` | Espelho: `progression.json` |
| Heat das torres | entities TS (`machine-gun`, `heavy-gun`) + `towers.json` heat | Não está no catálogo Firestore |

## Contrato JSON (`godot-export/data/` e `godot/data/`)

Gerado por `npm run export:godot` (`scripts/export-godot-data.ts`). Copia o mesmo payload para `../tower-tatics-3D/resources/data/`.

`constants.json`: `grid.rows/cols` (15), `portal_row_start/end` (4–9), `tile_size_m` (1), `camera.elevation_deg` (38), `camera.yaw_deg` (42), `monster_speed`, `monster_size`, `base_health` (20).

`map_N.json`: `id`, `nome`, `descricao`, `dificuldade`, `hordas`, `wave_interval_seconds`, `imagem` (`res://…`), `grid_color`, `tile_tint`, `dirt_tint`, `waves[]`.

Waves **já fatiadas**: Map2 15, Map3 20, Map4 25, Map5 40.

Wave: `wave_id`, `type`, `size`, `spawn_duration`, `gold`, `speed`, `max_health`, `spawn_per_side`, opcional `air`, `special`.

`towers.json`: as 6 torres (`machine-gun`, `missile`, `heavy-gun`, `electric`, `freeze`, `anti-air`). L1 em campos planos (`cost`, `range`, `attack_speed`, `attack_damage`, `aoe`, `attack_air`, `attack_terrain`), `sell_prices`, `upgrades` L2–L6, `heat` só em MG e heavy-gun.

`skills.json`: `energy` (3 segmentos, regen 15000 ms, tick 200 ms) + `blizzard` (custo 2, preview 6, raio 5.5).

`player.json`: HP 100, gold 60, leak 5, max tower level 6, max equipped 4, energy_start 0.

`progression.json`: mapa 1 unlocked; `map_rewards` 1→missile … 5→anti-air; default towers/skills.

Godot lê só JSON. Nenhum número de combate hardcoded em GDScript.

## Sync

- Login Google (web popup / Capacitor) ou email.
- Login → `syncFromRemote`.
- Mudança local de inventário/missão/skill/mapa → `syncFromLocal(..., true)` merge em `users/{uid}`.
- Catálogo de torres: leitura pública (regras Firestore; carrega antes do login).

## Legado vs Godot

No MVP Godot: JSON local basta (Map 1 offline). Firebase volta na fase de meta da migração — ver [godot-3d.md](../migration/godot-3d.md).

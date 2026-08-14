# Catálogo e dados

## Onde vive cada dado

| Dado | Onde | Notas |
|---|---|---|
| Combate/economia/upgrades de torres | Firestore `catalog_towers` | Obrigatório no boot 2D; throw se vazio. Seed: `yarn seed:catalog` |
| Definições de missões | Firestore `catalog_missions` | Opcional; `[]` se falhar |
| Progresso do usuário | `users/{uid}` + Capacitor Storage | mapProgress, towerInventory, missionProgress, skillProgress, som, idioma |
| Waves / monstros | `src/Game/common/hordes/` | Espelho JSON: `godot-export/data/map_N.json` |
| Meta de mapas | `maps-assets.ts` | Espelho: `maps_list.json` |
| Constantes de grid/speed/size | `cols.constants.ts`, `monsters.constants.ts` | Espelho: `constants.json` |
| Efeitos de skill | constantes locais | Não estão no export Godot hoje |
| Heat das torres | entidades TS (`machine-gun`, `heavy-gun`) | Não está no catálogo Firestore |

## Contrato JSON atual (`godot-export/data/`)

Gerado por `npx tsx scripts/export-godot-data.ts` (não está no `package.json`).

`constants.json`: `grid.rows/cols` (15), `monster_speed`, `monster_size`, `base_health` (20).

`map_N.json`: `id`, `nome`, `descricao`, `dificuldade`, `hordas`, `wave_interval_seconds`, `imagem` (`res://…`), `grid_color`, `tile_tint`, `dirt_tint`, `waves[]`.

Wave: `wave_id`, `type`, `size`, `spawn_duration`, `gold`, `speed`, `max_health`, `spawn_per_side`, opcional `air`, `special`.

**Falta no export (necessário na migração):** torres (stats/upgrades/sell/heat), skills/blizzard, player HP/gold, sell tax, map-rewards, missões fallback.

## Sync

- Login Google (web popup / Capacitor) ou email.
- Login → `syncFromRemote`.
- Mudança local de inventário/missão/skill/mapa → `syncFromLocal(..., true)` merge em `users/{uid}`.
- Catálogo de torres: leitura pública (regras Firestore; carrega antes do login).

## Legado vs Godot

No MVP Godot: JSON local basta (Map 1 offline). Firebase volta na fase de meta da migração — ver [godot-3d.md](../migration/godot-3d.md).

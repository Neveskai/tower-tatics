# Progressão

## Torres

Estado local (`tower_inventory`) + sync `users/{uid}`:

- `unlocked` — pode equipar
- `equipped` — aparece na loja da partida (máx. **4**)
- `discovered` — visível na UI de coleção

Default: `machine-gun` nos três arrays.

Unlock por clear de mapa (`getTowerUnlockForMap`):

| Mapa concluído | Torre |
|---|---|
| 1 Desert | `missile` |
| 2 Cemetery | `heavy-gun` |
| 3 Garden | `electric` |
| 4 Ice | `freeze` |
| 5 Hell | `anti-air` |

`machine-gun` não é recompensa de mapa.

## Mapas

`map_progress`: mapa 1 unlocked por default; os demais `unlocked: false`.

Ao vencer, `MissionCompleteScreen` chama `unlockMap` no **próximo** índice da lista (id sequencial 2 após 1, etc.).

## Skills

`skill_progress`: default unlocked+enabled = `blizzard`. Máx. 3 enabled. Novas skills só via recompensa de missão (`unlockSkills`).

## Missões

Definições em Firestore `catalog_missions`. Se vazio ou falha de load → `[]` (nenhuma missão). Tipos:

| `type` | `target` | Completa quando |
|---|---|---|
| `map-complete` | `{ mapId }` | `counters.mapsCompleted` contém o id |
| `kill-count` | `{ count }` | `counters.kills >= count` |
| `wave-count` | `{ count }` | `counters.waves >= count` |
| `tower-build` | `{ towerId, count }` | `buildsByTower[towerId] >= count` |
| `manual` | — | nunca automática |

Recompensas: `unlockTowers[]`, `unlockSkills[]`. Engine: após evento → atualiza counters → `evaluateAndApplyMissions()`. Missão já em `completed[id]` não reaplica.

Clear de mapa também chama `recordMapComplete` além do unlock direto por `map-rewards`.

# Monstros

Tipos (`MonsterType`): `slime`, `goblin`, `wolf`, `bee`, `plant`, `plantZombie`, `plantFire`, `orc`, `orcLord`, `slimeBoned`, `slimeVulcan`.

Stats por onda vêm da config da wave (`maxHealth`, `speed`, `gold`, `size`, `air`, `special`), não de um catálogo por tipo. O tipo escolhe animação/asset.

## Velocidade

Unidade: tiles por segundo (movimento usa `speed * TILE_SIZE / 1000` px/ms).

| ID | Fórmula | Valor |
|---|---|---|
| `VERY_SLOW` | 1 | 1 |
| `SLOW` | ×1.15 | 1.15 |
| `NORMAL` | ×1.15 | 1.3225 |
| `FAST` | ×1.25 | 1.653125 |
| `VERY_FAST` | ×1.1 | 1.8184375 |

Com slow: `baseSpeed * speedMultiplier * slowFactor`. Stun zera movimento.

## Tamanho

Multiplicadores visuais (HP bar e sprite), não ocupam tiles extras no grid.

| ID | Valor |
|---|---|
| `small` | 2 |
| `normal` (`MEDIUM`) | 2.4 |
| `big` | 2.8 |
| `huge` | 3.2 |
| `demonic` | 3.6 |

## Vida e ouro base (Map 1)

`BASE_HEALT = 20`. Waves do Map 1 usam `WAVE_BASE_HEALT = 160` e `WAVE_BASE_GOLD = 2`. Cada mapa define seus próprios multiplicadores nas hordes.

Kill: `+monster.gold`. Leak (chegou ao portal vivo): −5 HP do jogador, sem ouro.

## Flags `special`

| Flag | Efeito |
|---|---|
| `air` (no root da config, não em `special`) | Voa; pathfinding usa grid vazio; só torres com `attackAir`. |
| `stealth` | `revealed=false`; inalvoável. `reveal()` não é chamado no 2D. |
| `enrageOnLowHP` | Quando HP ≤ 30%, `speedMultiplier = 1.5` (uma vez). |
| `healer` | A cada **1000 ms**, cura aliados **+5** HP num raio de **3 tiles** (não cura a si). |
| `resistToSlow` | Fator de slow × **1.5**. |
| `resistToStun` | Duração de stun × **0.5**. |
| `spawnsOnDeath` | Após morte, spawna filhos na mesma posição com delay **400 ms**. |
| `spawnsPerTime` | A cada **10 s**, spawna filhos num tile adjacente livre (3×3). |
| `noGoldReward` | Declarado em algumas waves; **não é lido** na economia — ouro ainda é pago. |
| `armor` | Tipo `none \| low \| high`; **sem efeito** de dano. |

Filhos de spawn usam a `MonsterConfig` aninhada (próprio HP, gold, tipo, special).

## Pathing

Terrestres: A* no grid ocupado. Aéreos: `EMPTY_GRID` (ignoram torres). Spawn numa das 6 linhas do portal esquerdo; destino = 6 tiles do portal direito. Ao colocar uma torre no caminho, o monstro recalcula.

Ver [placement-and-pathfinding.md](placement-and-pathfinding.md).

## Snapshot Map 1 (ondas jogáveis)

`WAVE_BASE_HEALT = 160`, `WAVE_BASE_GOLD = 2`, `WAVE_BASE_SPAWN = 10`, `spawnDuration = 5000` ms (wave 5: 2500 ms).

| Wave | Tipo | Size | HP | Gold | Spawn | Speed | Notas |
|---|---|---|---|---|---|---|---|
| 1 | slime | small | 160 | 2 | 10 | VERY_SLOW | |
| 2 | goblin | normal | 320 | 3 | 9 | SLOW | |
| 3 | slime | normal | 320 | 2 | 9 | SLOW | `spawnsOnDeath` slime small HP 160 gold 1 FAST |
| 4 | goblin | normal | 400 | 2 | 9 | NORMAL | |
| 5 | wolf | big | 2160 | 20 | 1 | FAST | boss-ish |
| 6 | goblin | normal | 240 | 2 | 10 | NORMAL | |
| 7 | slime | big | 640 | 2 | 10 | VERY_SLOW | `spawnsPerTime` slime small |
| 8 | wolf | small | 480 | 2 | 10 | FAST | |
| 9 | goblin | normal | 480 | 2 | 12 | NORMAL | |
| 10 | bee | small | 320 | 3 | 9 | SLOW | **air** |

Waves dos mapas 2–5: arquivos em `src/Game/common/hordes/map_N/` (espelho JSON em `godot-export/data/map_N.json`). O jogo fatia o array (`slice`) ao número jogável — ver [maps-and-waves.md](maps-and-waves.md).

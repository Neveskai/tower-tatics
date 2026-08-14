# Skills

Único ID: `blizzard` (Nevasca). Skill inicial: unlocked e enabled.

## Energia

| Constante | Valor |
|---|---|
| Segmentos máximos | 3 |
| Regen | 15 000 ms por segmento |
| Tick de regen | 200 ms |
| Início de partida | 0 segmentos |
| Custo `blizzard` | 2 segmentos |

Regen só conta quando o jogo está rodando. `canSpend` / `spend` consomem segmentos inteiros. Dev flag `infiniteMana` ignora custo.

Loadout: no máximo **3** skills enabled (`MAX_ENABLED`). Hoje só existe uma.

## Blizzard

Área clicada no grid (preview 6×6). Centro = tile clicado.

| Param | Valor | Constante |
|---|---|---|
| Tamanho visual / preview | 6 tiles | `BLIZZARD_SIZE` |
| Duração | 5000 ms | `BLIZZARD_DURATION_MS` |
| Slow factor | 0.3 | `BLIZZARD_SLOW_FACTOR` |
| Slow linger | 1.5 s após o tick | `BLIZZARD_SLOW_DURATION` |
| Dano por tick | 10 | `BLIZZARD_DAMAGE_PER_TICK` |
| Intervalo de tick | 500 ms | `BLIZZARD_TICK_INTERVAL_MS` |

Cada tick: query circular de raio **5.5 tiles** a partir do centro do tile (ar e chão; stealth ainda bloqueia via `getEnemiesInRange`). Aplica slow + dano a cada vivo no raio.

Afeta aéreos e terrestres. Não atravessa stealth ativo.

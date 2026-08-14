# Torres

IDs: `machine-gun` | `missile` | `heavy-gun` | `electric` | `freeze` | `anti-air`.

Nível 1–6. Stats de L1 vêm da config base; L2–L6 de `upgrades[n]`. Fonte de runtime: Firestore `catalog_towers` (espelho em `TowerConfigs`).

## Regras globais

| Constante | Valor |
|---|---|
| `MAX_TOWER_LEVEL` | 6 |
| Duração de upgrade | `3000 * 1.35^(level-1)` ms |
| `SELL_TAX` | 0.5 (preços de venda pré-calculados) |
| `BASE_BULLET_MS` | 200 (velocidade base do projétil) |
| Footprint | 2×2 tiles |
| Loadout | no máximo **4** torres equipadas |
| Torre inicial | `machine-gun` (unlocked / equipped / discovered) |

## Custos de construção (L1)

| Torre | Custo | Fórmula |
|---|---|---|
| `machine-gun` | 5 | base |
| `heavy-gun` | 15 | ×3 |
| `missile` | 20 | ×4 |
| `electric` | 30 | ×6 |
| `freeze` | 50 | ×10 |
| `anti-air` | 50 | ×10 |

## Stats por nível

Range em tiles. Attack speed em tiros/s. AoE em tiles.

### machine-gun — ar e chão, sem especial

| Nível | Range | AtkSpeed | Dano | AoE | Custo upgrade |
|---|---|---|---|---|---|
| 1 | 4 | 0.75 | 20 | 0 | — (construir 5) |
| 2 | 4 | 0.75 | 40 | 0 | 5 |
| 3 | 4 | 0.75 | 100 | 0 | 15 |
| 4 | 4 | 0.75 | 260 | 0 | 40 |
| 5 | 4 | 0.75 | 500 | 0 | 60 |
| 6 | 8 | 0.60 | 1000 | 0 | 90 |

Heat: max 100, +10/tiro, cool 0.08/ms. Bullet: 200, 5×20, `bullet-mg`.

Venda L1–L6: 2, 5, 12, 32, 62, 107.

### missile — só chão, AoE 3

| Nível | Range | AtkSpeed | Dano | AoE | Custo upgrade |
|---|---|---|---|---|---|
| 1 | 6 | 0.30 | 40 | 3 | — (construir 20) |
| 2 | 6 | 0.30 | 80 | 3 | 20 |
| 3 | 6 | 0.30 | 200 | 3 | 60 |
| 4 | 6 | 0.35 | 440 | 3 | 120 |
| 5 | 6 | 0.35 | 1000 | 3 | 240 |
| 6 | 7 | 0.40 | 1720 | 3 | 360 |

Bullet: 200, 20×20, `bullet-missile`. Venda: 10, 20, 50, 100, 220, 400.

### heavy-gun — ar e chão, heat

| Nível | Range | AtkSpeed | Dano | AoE | Custo upgrade |
|---|---|---|---|---|---|
| 1 | 5 | 5.0 | 10 | 0 | — (construir 15) |
| 2 | 5 | 5.0 | 20 | 0 | 15 |
| 3 | 5 | 5.0 | 50 | 0 | 45 |
| 4 | 5 | 5.0 | 130 | 0 | 120 |
| 5 | 5 | 5.5 | 340 | 0 | 240 |
| 6 | 6 | 5.5 | 720 | 0 | 360 |

Heat: max 120, +15/tiro, cool 0.06/ms. Bullet: 800, 10×16. Venda: 7, 15, 37, 97, 217, 382.

### electric — só chão, stun, hit instantâneo

| Nível | Range | AtkSpeed | Dano | AoE | Stun chance | Stun s | Custo upgrade |
|---|---|---|---|---|---|---|---|
| 1 | 2.5 | 0.5 | 40 | 2.5 | 0.10 | 0.65 | — (construir 30) |
| 2 | 2.5 | 0.5 | 80 | 2.5 | 0.12 | 0.65 | 30 |
| 3 | 2.5 | 0.5 | 200 | 2.5 | 0.14 | 0.65 | 90 |
| 4 | 2.5 | 0.5 | 400 | 2.5 | 0.16 | 0.65 | 150 |
| 5 | 2.5 | 0.5 | 680 | 2.5 | 0.18 | 0.70 | 210 |
| 6 | 2.5 | 0.5 | 1080 | 2.5 | 0.20 | 0.75 | 300 |

Dano real usa raio `(range + 1)` = 3.5 tiles, todos os terrestres. Sem projétil. Venda: 15, 30, 75, 150, 255, 390.

### freeze — ar e chão, slow

| Nível | Range | AtkSpeed | Dano | Slow factor | Slow s | Custo upgrade |
|---|---|---|---|---|---|---|
| 1 | 4 | 2 | 5 | 0.75 | 3.5 | — (construir 50) |
| 2 | 4 | 2 | 10 | 0.80 | 3.5 | 25 |
| 3 | 4 | 2 | 15 | 0.75 | 3.5 | 25 |
| 4 | 4 | 2 | 20 | 0.70 | 3.5 | 25 |
| 5 | 4 | 2 | 25 | 0.65 | 4.0 | 25 |
| 6 | 5 | 2 | 50 | 0.65 | 4.0 | 50 |

L2 tem slow **mais fraco** que L1 (0.80 vs 0.75) — comportamento atual. Slow só no alvo primário. Venda: 25, 37, 50, 62, 75, 100.

### anti-air — só ar, AoE 2

| Nível | Range | AtkSpeed | Dano | AoE | Custo upgrade |
|---|---|---|---|---|---|
| 1 | 4 | 1.25 | 80 | 2 | — (construir 50) |
| 2 | 4 | 1.25 | 160 | 2 | 50 |
| 3 | 4 | 1.25 | 340 | 2 | 100 |
| 4 | 4 | 1.25 | 620 | 2 | 150 |
| 5 | 4 | 1.50 | 1080 | 2 | 250 |
| 6 | 5 | 1.75 | 1720 | 2 | 350 |

Bullet: 150, 7×15, `bullet-anti-air`. Venda: 25, 50, 100, 175, 300, 475.

## Elementos (catálogo, sem combate)

| Torre | element |
|---|---|
| machine-gun, heavy-gun, anti-air | `neutral` |
| missile | `fire` |
| electric | `lightning` |
| freeze | `ice` |

## Shop

A loja in-match mostra **apenas** torres do loadout equipado (`MAX_EQUIPPED = 4`). Compra exige ouro ≥ custo e placement válido.

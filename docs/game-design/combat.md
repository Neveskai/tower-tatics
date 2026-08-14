# Combate

Dano é `Math.floor(base)` com mínimo 0 (`resolveDamage`). Não há tipos elementais em combate (o campo `element` do catálogo não altera dano).

## Targeting

Torres com projétil (`machine-gun`, `missile`, `heavy-gun`, `freeze`, `anti-air`):

1. Query circular: `range` tiles a partir do centro da torre.
2. Filtra `attackAir` / `attackTerrain`.
3. Ignora monstros com stealth ativo (`stealth && !revealed`).
4. Mantém o alvo atual enquanto ele estiver vivo e dentro do alcance.
5. Sem alvo: escolhe o inimigo vivo com **maior `getProgressToPortal()`** (mais avançado no caminho).

`electric` não usa esse sticky-target: a cada tick, se houver qualquer candidato no alcance, dispara e acerta **todos** os terrestres num raio de `(range + 1)` tiles.

Durante upgrade a torre não atira.

## Air / ground

| Flag da torre | Ataca aéreo | Ataca terrestre |
|---|---|---|
| `machine-gun` | sim | sim |
| `missile` | não | sim |
| `heavy-gun` | sim | sim |
| `electric` | não | sim |
| `freeze` | sim | sim |
| `anti-air` | sim | não |

Monstro com `air: true` é aéreo (`isAir`); caso contrário é terreno.

**Quirk:** projéteis com AoE iteram **todos** os monstros no raio do impacto, sem refiltrar air/ground. Um míssil pode ferir aéreos próximos do alvo terrestre.

## AoE

- Projétil com `AoE > 0`: dano cheio em todos os monstros a ≤ `AoE` tiles do **alvo**.
- `electric`: dano + roll de stun em todos os terrestres em `(range + 1)` tiles da torre (não usa projétil).
- `freeze` aplica slow só no alvo primário (`AoE = 0`).

## Stealth

- `special.stealth` → `revealed = false` no spawn.
- `getEnemiesInRange` exclui `isStealthActive`.
- `reveal()` existe mas **não é chamado** em nenhum ponto do código 2D: stealth permanece inalvoável até o leak (comportamento atual; não “corrigir” na migração sem atualizar este doc).

## Slow e stun

| Efeito | Origem | Resistência |
|---|---|---|
| Slow | `freeze` (por tiro), `blizzard` (por tick) | `resistToSlow`: fator × **1.5** (slow mais fraco) |
| Stun | `electric` (chance por disparo) | `resistToStun`: duração × **0.5** |

Slow: menor `slowFactor` = mais lento. Velocidade efetiva = `baseSpeed * speedMultiplier * slowFactor`.

Stun: monstro não se move enquanto `stunned`.

## Heat / overheat

Só `machine-gun` e `heavy-gun`. A cada tiro: `heat += heatPerShot`. Se `heat >= maxHeat` → `isOverheated`, não atira. Esfria `coolRate * deltaMS` por frame; overheat acaba quando `heat === 0`.

| Torre | maxHeat | heatPerShot | coolRate (/ms) |
|---|---|---|---|
| `machine-gun` | 100 | 10 | 0.08 |
| `heavy-gun` | 120 | 15 | 0.06 |

## Upgrade e combate

Duração: `3000 * 1.35^(level-1)` ms. A torre não atira durante o upgrade. Timer só avança com o jogo rodando (não em pause).

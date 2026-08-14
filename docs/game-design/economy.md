# Economia

Não há meta-currency. Só ouro in-match + unlocks de progressão.

## Partida

| Regra | Valor |
|---|---|
| Ouro inicial | **60** |
| Kill | `+monster.gold` |
| Leak | 0 ouro (só −5 HP) |
| Compra | se `playerGold >= cost`, decrementa e instancia |
| Upgrade | se ouro ≥ `upgrades[next].cost` e nível < 6 |

`noGoldReward` **não** zera o ouro (flag morta).

## Venda

| Momento | Reembolso |
|---|---|
| Pre-game (`pause && currentHorde === 0`) | custo de **construção** (`tower.cost`), não a soma dos upgrades |
| Mid-game | `sell_prices[level]` (modelo ~50% do custo acumulado por multiplicadores) |

Preços de venda por torre: [towers.md](towers.md).

Quirk da venda pre-game: devolve só o custo L1, mesmo se a torre foi upada no pre-game (upgrades pre-game não avançam o timer enquanto pausado, então na prática o upgrade só completa in-wave).

## Recompensas de mapa (não são ouro)

Completar o mapa N destrava a próxima torre e o próximo mapa — [progression.md](progression.md). Sem gold persistente entre partidas.
